'use client'

import { fetchCart } from "../services/api";

fetchCart().then(data => console.log("cart data:",data)).catch(err => console.error(err));

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Hello
    </div>
  );
}
