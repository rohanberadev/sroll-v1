import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { CommentDrawer } from "~/features/comment/components/comment-drawer";
import { FollowButton } from "~/features/follow/components/follow-button";
import { UserAvatar } from "~/features/user/components/user-avatar";
import { getPostsFeed } from "../db/posts";
import { LikeButton } from "./like-button";
import { PostCarousel } from "./post-carousel";
import { SaveButton } from "./save-button";

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

export function ShowPost({
    post,
}: {
    post: Awaited<ReturnType<typeof getPostsFeed>>[number];
}) {
    return (
        <Card className="flex w-[350px] flex-col rounded-sm border-gray-600 bg-black text-stone-400 max-xs:rounded-none max-xs:border-l-0 max-xs:border-r-0 max-xs:border-t-0 md:w-[375px] lg:w-[400px] lg:border-[1px] min-h-[500px] max-h-none">
            <CardHeader className="flex w-full flex-row items-center justify-between border-b-[1px] border-gray-400 pb-4">
                <div className="flex items-center gap-x-4">
                    <Link href={`/profile/${post.user?.username}`}>
                        <UserAvatar avatarImageUrl={post.user?.imageUrl!} />
                    </Link>
                    <CardTitle className="flex items-center gap-x-4">
                        <Link
                            href={`/profile/${post.user?.username}`}
                            className="transition-all duration-300 hover:underline"
                        >
                            {post.user?.username}
                        </Link>
                        {!(post.isFollowedByUser || post.isPostedByUser) ? (
                            <FollowButton
                                className="h-[22]"
                                userId={post.userId}
                            />
                        ) : null}
                    </CardTitle>
                </div>
                {/* <PostInfoButton
          username={post.postedBy.name}
          postedAt={post.postedAt}
          isPostOwner={post.isPostOwner}
        /> */}
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {post.imageUrls && <PostCarousel imageUrls={post.imageUrls} />}
            </CardContent>
            <CardFooter className="flex flex-1 flex-col gap-y-6 border-t-[1px] border-gray-400 pt-4">
                <div className="flex w-full justify-between">
                    <div className="flex items-center gap-x-6">
                        <LikeButton
                            activeColor="text-red-600"
                            active={post.isLikedByUser}
                            className="h-[1.4rem] w-[1.4rem]"
                            initialLikeCount={post.likeCount}
                            postId={post.id}
                        />
                        <CommentDrawer
                            className="h-5 w-5"
                            initialCommentCount={post.commentCount}
                            username={post.user?.username!}
                            postId={post.id}
                            postVisibilty={post.visibilty}
                        />
                        {/* <ShareButton className="h-5 w-5" shareCount={post.shares} /> */}
                    </div>
                    <SaveButton
                        isSavedByUser={post.isSavedByUser}
                        postId={post.id}
                    />
                </div>

                <div className="flex w-full justify-start">
                    <p className="text-sm">
                        Liked by <span className="font-bold">username</span> and{" "}
                        <span className="font-bold">
                            {post.likeCount} others
                        </span>
                    </p>
                </div>

                <div className="flex w-full flex-col justify-start text-sm">
                    <p>Post Caption - {post.caption}</p>
                    <span>
                        Uploaded at {new Date(post.createdAt).toDateString()}
                    </span>
                    <span>
                        Edited at {new Date(post.updatedAt).toDateString()}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
