import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PostTable } from "~/drizzle/schema";
import { PostCarousel } from "./post-carousel";

export function ShowPost({ post }: { post: typeof PostTable.$inferSelect }) {
  return (
    <Card className="flex w-[350px] flex-col rounded-sm border-gray-600 bg-black text-stone-400 max-xs:rounded-none max-xs:border-l-0 max-xs:border-r-0 max-xs:border-t-0 md:w-[375px] lg:w-[400px] lg:border-[1px]">
      <CardHeader className="flex w-full flex-row items-center justify-between border-b-[1px] border-gray-400 p-4">
        <div className="flex items-center gap-x-4">
          <Link href={`/profile/`}>{/* <Avatar /> */}</Link>
          <CardTitle className="flex items-center gap-x-4">
            <Link
              href={`/profile/`}
              className="transition-all duration-300 hover:underline"
            >
              {/* {post.postedBy.name} */}
            </Link>
            {/* {post.postedBy.isFollowedByUser || post.isPostOwner ? null : (
              // <FollowButton className="h-[22]" userId={post.postedById} />
            )} */}
          </CardTitle>
        </div>
        {/* <PostInfoButton
          username={post.postedBy.name}
          postedAt={post.postedAt}
          isPostOwner={post.isPostOwner}
        /> */}
      </CardHeader>
      <CardContent className="w-full h-full p-0">
        {post.imageUrls && <PostCarousel imageUrls={post.imageUrls} />}
      </CardContent>
      <CardFooter className="flex flex-1 flex-col gap-y-6 border-t-[1px] border-gray-400 pt-4">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-x-6">
            {/* <LikeButton
              activeColor="text-red-600"
              active={post.isLikedByUser}
              className="h-[1.4rem] w-[1.4rem]"
              likes={post.likes}
              postId={post.id}
            />
            <CommentButton
              className="h-5 w-5"
              initialCommentCount={post.comments}
              username={post.postedBy.name}
              postId={post.id}
              postType={post.type}
            /> */}
            {/* <ShareButton className="h-5 w-5" shareCount={post.shares} /> */}
          </div>
          {/* <SaveButton isSavedByUser={post.isSavedByUser} postId={post.id} /> */}
        </div>

        <div className="flex w-full justify-start">
          <p className="text-sm">
            Liked by <span className="font-bold">username</span> and{" "}
            <span className="font-bold">{post.likeCount} others</span>
          </p>
        </div>

        <div className="flex w-full flex-col justify-start text-sm">
          <p>{post.caption}</p>
          <span>Viewed by {post.viewCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
