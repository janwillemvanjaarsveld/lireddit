import { Post } from '../entities/Post';
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';
import { Updoot } from '../entities/Updoot';
import { User } from '../entities/User';
import { sendEmail } from '../utils/sendEmail';
import { UserApplyPostInput } from './user';

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
}

@InputType()
class ApplyPostInput {
    @Field(() => Int)
    id: number;
    @Field()
    title: string;
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
        return root.text.slice(0, 50);
    }

    @FieldResolver(() => User)
    creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(post.creatorId);
    }

    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(
        @Root() post: Post,
        @Ctx() { updootLoader, req }: MyContext
    ) {
        if (!req.session.userId) return null;
        const updoot = await updootLoader.load({
            postId: post.id,
            userId: req.session.userId,
        });
        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    apply(
        @Arg('post') post: ApplyPostInput,
        @Arg('user') user: UserApplyPostInput,
        @Arg('motivation') motivation: string
    ) {
        sendEmail(
            'hr@xfour.co.za',
            `<h4>Dear XFour HR</h4>
                <p>An application has been submitted by <strong>${user.username}</strong> for the position of <strong><a href="http://localhost:3000/post/${post.id}">${post.title}</a></strong>.</p>
                <strong><u>Motivation:</u></strong>
                <p>${motivation}</p>
                <p>Regards,</p>
                <p>XFour Career Hub</p>`
        );
        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;

        const updoot = await Updoot.findOne({ where: { postId, userId } });

        if (updoot && updoot.value !== realValue) {
            // voting again
            const queryRunner = getConnection().createQueryRunner();
            // start a transaction
            await queryRunner.startTransaction();
            try {
                await Updoot.update({ userId, postId }, { value: realValue });
                await Post.update(
                    { id: postId },
                    { points: () => `points + ${2 * realValue}` }
                );
                // commit transaction
                await queryRunner.commitTransaction();
            } catch (err) {
                // rollback transaction
                await queryRunner.rollbackTransaction();
            } finally {
                // release transaction
                await queryRunner.release();
            }
        } else if (!updoot) {
            // has never voted before
            const queryRunner = getConnection().createQueryRunner();
            // start a transaction
            await queryRunner.startTransaction();
            try {
                await Updoot.insert({ userId, postId, value: realValue });
                await Post.update(
                    { id: postId },
                    { points: () => `points + ${realValue}` }
                );
                // commit transaction
                await queryRunner.commitTransaction();
            } catch (err) {
                // rollback transaction
                await queryRunner.rollbackTransaction();
            } finally {
                // release transaction
                await queryRunner.release();
            }
        }

        return true;
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(
            `
            select p.*
            from post p
            ${cursor ? `where p."createdAt" < $2` : ''}
            order by p."createdAt" DESC
            limit $1
        `,
            replacements
        );

        // this executes the statement
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    createPost(
        @Arg('input') input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        return Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Arg('text') text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
            .returning('*')
            .execute();

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        await Post.delete({ id, creatorId: req.session.userId });
        return true;
    }
}
