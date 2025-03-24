// import { redirect } from 'next/navigation';
// export default function Home({}) {
//   redirect('/admin/dashboard');
// }
import { redirect } from 'next/navigation';
export default function Home({}) {
  redirect('/auth/sign-in');
}
