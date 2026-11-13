import { FeedHome } from "@/components/home/feed-home";
import { classroom, posts, teacher } from "@/data/feed";
import { kids } from "@/data/kids";

export default function Home() {
  return (
    <FeedHome
      classroom={classroom}
      demoPosts={posts}
      kids={kids}
      teacher={teacher}
    />
  );
}
