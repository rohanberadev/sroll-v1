import { redirect } from "next/navigation";
import { MyTabsTrigger } from "~/components/my-tabs-trigger";
import { TabsContainer } from "~/components/tabs-container";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { getPublicPostsOfUser } from "~/features/post/actions/posts";
import { PublicPostsGrid } from "~/features/post/components/post-grids";

export default async function ProfileTabs({ userId }: { userId: string }) {
  const { error, data } = await getPublicPostsOfUser({ userId });

  if (error || !data) {
    redirect("/error");
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="sticky top-0 z-50 flex w-full items-center justify-between rounded-none border-gray-800 bg-black p-0 max-lg:top-14 lg:gap-x-[0.1rem] lg:rounded-t-md lg:border-l-[1px] lg:border-r-[1px] lg:border-t-[1px] text-white border-b-[1px] py-8">
        <MyTabsTrigger value="all" label="All" />
        <MyTabsTrigger value="followers" label="Followers" />
        <MyTabsTrigger value="you" label="You" />
      </TabsList>
      <TabsContent value="all" className="">
        <TabsContainer>
          <PublicPostsGrid initialPosts={data} />
        </TabsContainer>
      </TabsContent>
      <TabsContent value="followers" className="mt-3">
        <TabsContainer>
          {/* <PostGrid /> */}
          <p></p>
        </TabsContainer>
      </TabsContent>
      <TabsContent value="you" className="mt-3">
        <TabsContainer>
          {/* <PostGrid /> */}
          <p></p>
        </TabsContainer>
      </TabsContent>
    </Tabs>
  );
}
