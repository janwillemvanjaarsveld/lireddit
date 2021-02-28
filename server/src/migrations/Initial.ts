import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1614523509468 implements MigrationInterface {
    name = 'Initial1614523509468';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "isAdmin" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "updoot" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_6476d7e464bcb8571004134515c" PRIMARY KEY ("userId", "postId"))`
        );
        await queryRunner.query(
            `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "updoot" ADD CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "updoot" ADD CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );

        // add admin user
        await queryRunner.query(
            `insert into public."user" (name, username, email, "password", "createdAt", "updatedAt", "isAdmin") values ('Administrator', 'admin', 'admin@xfour.co.za', '$argon2i$v=19$m=4096,t=3,p=1$33ivPANOIhPJ/66XvNSYfQ$sA76AU9GqK2xhIOdW2/vZ2L0xOOwAxnKa5by7Gt4S2c', now(), now(), true);`
        );

        // add data
        await queryRunner.query(
            `insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Analyst Programmer', 'Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', 1, '2020-02-03T02:35:54Z', '2019-08-18T03:55:59Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Nuclear Power Engineer', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', 1, '2020-09-11T17:48:05Z', '2019-06-16T19:32:32Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Operator', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.
            
            Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', 1, '2019-09-22T15:51:11Z', '2019-03-21T08:56:57Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Chief Design Engineer', 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.
            
            Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', 1, '2019-11-11T14:50:48Z', '2020-09-18T16:29:03Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Structural Analysis Engineer', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            
            Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 1, '2019-08-10T03:35:26Z', '2020-04-29T20:22:41Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Human Resources Assistant II', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.
            
            Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.
            
            Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', 1, '2019-07-26T16:08:07Z', '2019-12-01T16:26:55Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Automation Specialist III', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.', 1, '2021-01-13T13:38:38Z', '2019-07-27T18:11:01Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Payment Adjustment Coordinator', 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.
            
            Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.
            
            Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', 1, '2019-11-12T05:50:53Z', '2020-02-26T05:03:40Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Environmental Specialist', 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', 1, '2019-03-24T01:44:51Z', '2019-10-05T17:10:30Z');
            insert into post (title, text, "creatorId", "createdAt", "updatedAt") values ('Help Desk Operator', 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.
            
            Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            
            Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 1, '2019-08-21T22:33:20Z', '2019-09-04T07:41:29Z');
            
            `
        );
    }

    public async down(_: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        // await queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5"`);
        // await queryRunner.query(`ALTER TABLE "updoot" DROP CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68"`);
        // await queryRunner.query(`DROP TABLE "post"`);
        // await queryRunner.query(`DROP TABLE "updoot"`);
        // await queryRunner.query(`DROP TABLE "user"`);
    }
}
