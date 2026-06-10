import { redirect } from 'next/navigation';

export default function Home() {
  // This tells the Next.js server to instantly bounce the user to the login route
  redirect('/login');
}