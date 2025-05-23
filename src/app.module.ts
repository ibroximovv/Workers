import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegoinModule } from './regoin/regoin.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SmsService } from './sms/sms.service';
import { MailService } from './mail/mail.service';
import { BrandModule } from './brand/brand.module';
import { CapasityModule } from './capasity/capasity.module';
import { PartnerModule } from './partner/partner.module';
import { LevelModule } from './level/level.module';
import { SizeModule } from './size/size.module';
import { MasterModule } from './master/master.module';
import { ProductModule } from './product/product.module';
import { ToolModule } from './tool/tool.module';
import { OrderModule } from './order/order.module';
import { BacketModule } from './backet/backet.module';
import { MasterOrderModule } from './master-order/master-order.module';
import { CommentModule } from './comment/comment.module';
import { ContactModule } from './contact/contact.module';
import { FaqModule } from './faq/faq.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { GenerealInfoModule } from './genereal-info/genereal-info.module';

@Module({
  imports: [RegoinModule, PrismaModule, UserModule, AuthModule, MailModule, BrandModule, CapasityModule, PartnerModule, LevelModule, SizeModule, MasterModule, ProductModule, ToolModule, OrderModule, BacketModule, MasterOrderModule, CommentModule, ContactModule, FaqModule, ShowcaseModule, GenerealInfoModule],
  controllers: [AppController],
  providers: [AppService, SmsService],
})
export class AppModule {}
