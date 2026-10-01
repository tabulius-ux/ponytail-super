# Infinite Scroll

**Task:** "Load more items when the user scrolls to the bottom."

## Without Ponytail

```bash
npm install react-infinite-scroll-component
```

```jsx
import InfiniteScroll from "react-infinite-scroll-component";

export function Feed({ items, fetchMore, hasMore }) {
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<Spinner />}
      endMessage={<p>No more items</p>}
      scrollThreshold={0.9}
    >
      {items.map(item => <Card key={item.id} item={item} />)}
    </InfiniteScroll>
  );
}
```

A scroll component may also supply loading, end-of-list, error, and concurrency behavior. Preserve those responsibilities when replacing it.

## Native primitive (partial illustration)

```jsx
// Visibility detection only; fetchMore must preserve request safeguards.
import { useEffect, useRef } from "react";

export function Feed({ items, fetchMore, hasMore }) {
  const sentinel = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) fetchMore();
    });
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, fetchMore]);

  return (
    <>
      {items.map(item => <Card key={item.id} item={item} />)}
      <div ref={sentinel} />
    </>
  );
}
```

This partial snippet only demonstrates visibility detection; it is not an equivalent replacement for the component above. Before using it, retain loading/end/error states, pagination and request deduplication or concurrency limits, keyboard-accessible loading controls, and cleanup. Specify what happens when the sentinel remains visible after a page arrives. Keep the existing component if it already covers those requirements; a shorter observer callback is not enough.
