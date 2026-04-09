import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Necessário para ler o .env
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './Users/users.module'; // aqui imprta o módulo e não o controller
import { ProductsModule } from './Products/products.module';
import { CategoryModule } from './Categories/categories.module';
import { SupplierModule } from './Suppliers/supplier.module';
import { IngredientModule } from './Ingredients/ingredients.module';
import { RecipeModule } from './Recipe/recipe.module';
import { RecipeIngredientModule } from './RecipeIngredient/recipe-ingredient.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    // Carrega as variáveis do arquivo .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Cria a conexão com o banco de dados
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', ''),
        autoLoadEntities: true, // Faz com que todas as entidades sejam lidas sem precisar passar diretamente
        synchronize:
          configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get<string>('DB_LOGGING', 'true') === 'true',
      }),
    }),

    // 3. Importa o módulo de usuários (que já tem o controller e o service dentro dele)
    UsersModule,
    ProductsModule,
    CategoryModule,
    SupplierModule,
    IngredientModule,
    RecipeModule,
    RecipeIngredientModule,
    AuthModule,
  ],
})
export class AppModule {}
