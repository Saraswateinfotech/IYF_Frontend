/*eslint-disable*/
export default function Footer() {
  return (
    <div className="z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-[20px] pb-4 lg:mb-6 lg:max-w-[100%] lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6">
      <p className="mb-6 text-center text-sm text-gray-600 md:text-base lg:mb-0">
      ©{new Date().getFullYear()} IYF Dashboard. All Rights Reserved. Made with love by{" "}
          <a 
            href="https://saraswate-infotech.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500  font-bold hover:underline"
          >
            Saraswate Info Tech!
          </a>
      </p>
    </div>
  );
}
