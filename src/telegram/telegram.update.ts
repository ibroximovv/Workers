// import { Command, On, Start, Update, Use } from "nestjs-telegraf";
// import { PrismaService } from "src/prisma/prisma.service";
// import { Context, Markup } from "telegraf";
// import axios from "axios";
// import { Message } from "telegraf/typings/core/types/typegram";
// import { repl } from "@nestjs/core";

// const CHANNEL_ID = '@ibroximov13';

// interface BookRow {
//   name: string;
//   price: number;
//   year: number;
// }


// @Update()
// export class TgUpdate {
//   constructor(private readonly prisma: PrismaService, private readonly book: any) {}

//   @Start()
//   async onStart(ctx: Context) {
//     const data = await this.prisma.generalInfo.findFirst({ where: { telegramId: ctx.from?.id } });
    
//   }

//   @Command('get')
//   async getAllBooks(ctx: Context) {
//     const data = await this.book.findAll();

//     if (!data.length) {
//       return ctx.reply('📚 Kitoblar topilmadi.');
//     }

//     const message = data
//       .map(
//         (book, i) =>
//           `${i + 1}. ${book.name}  \n ID: ${book.id}\n Narxi: ${book.price} so'm\n Yili: ${book.year}\n`
//       )
//       .join('\n----------------------\n');
//     ctx.reply(message);
//   }

//   @Command('add')
//   async createBook(ctx: Context) {
//     ctx.reply('Name, Price, Year ustunlaridan iborat .xlsx faylini yuboring');
//   }

//   @On('document')
//   async handleExcelFile(ctx: Context) {
//     if (!('message' in ctx) || !ctx.message || !('document' in ctx.message)) {
//       return ctx.reply('Iltimos, Excel faylini yuboring.');
//     }

//     const document = ctx.message.document;
//     const mimeType = document.mime_type;

//     if (mimeType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       return ctx.reply('Faqat .xlsx (Excel) fayl yuboring.');
//     }

//     const fileId = document.file_id;

//     try {
//       const file = await ctx.telegram.getFile(fileId);
//       if (!file.file_path) {
//         return ctx.reply('Faylni yuklab olishda xato yuz berdi: Fayl yoli topilmadi.');
//       }

//       console.log('File path:', file.file_path); 

//       const fileUrl = `https://api.telegram.org/file/bot7973147353:AAGDbfJsFIwOXZIXo36wZiz17D84kIpjcyo/${file.file_path}`;
//       console.log('File URL:', fileUrl); 

//       const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//       const buffer = Buffer.from(response.data);

//       const workbook = xlsx.read(buffer, { type: 'buffer' });
//       const firstSheet = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[firstSheet];

//       const rows = xlsx.utils.sheet_to_json(sheet, {
//         header: ['name', 'price', 'year'], 
//         raw: false,
//       });

//       console.log('Excel rows:', rows); 

//       if (!rows.length) {
//         return ctx.reply('Excel faylda malumotlar topilmadi.');
//       }

//       let successCount = 0;

//       for (const row of rows as BookRow[]) {
//         const name = row.name;
//         const price = Number(row.price);
//         const year = Number(row.year);

//         if (name && !isNaN(price) && !isNaN(year)) {
//           await this.book.create({
//             name: String(name),
//             price,
//             year,
//           });
//           successCount++;
//         } else {
//           console.log('Notogri qator:', row); 
//         }
//       }

//       if (successCount > 0) {
//         await ctx.reply(`${successCount} ta kitob muvaffaqiyatli qoshildi.`);
//       } else {
//         await ctx.reply('Yaroqli malumotlar topilmadi. Name, Price, Year ustunlari togri ekanligini tekshiring.');
//       }
//     } catch (error) {
//       console.error('Xato tafsilotlari:', {
//         message: error.message,
//         stack: error.stack,
//         response: error.response ? error.response.data : null,
//       });
//       await ctx.reply(`Excel faylni qayta yuboring. Xatolik: ${error.message}`);
//     }
//   }

//   @Command('delete')
//   async deleteBook(ctx: Context) {
//     await ctx.reply(`Ochirmoqchi bolgan kitob ID sini yuboring`)
//   }

//   @On('text')
//   async onText(ctx: Context) {
//     const message = ctx.message as Message.TextMessage
//     const data = await this.book.remove(message.text)
//     ctx.reply(data)
//   }
// }