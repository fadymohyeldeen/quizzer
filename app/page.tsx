import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="mt-0 flex justify-center items-center w-full h-screen relative">
        <Image src="/BGWalkingMan.svg" alt="Background Walking Man" className="absolute inset-0 w-full h-full object-fill opacity-35"
          width={1000}
          height={1000} />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              Welcome To <span className="text-red-600">Quizzer.</span>
            </h1>
            <p className="mb-6 text-sm text-gray-600 sm:text-xl lg:mb-8">
              Challenge yourself and others with our wide variety of quizzes! Test your knowledge and learn something new every day.
            </p>
            <Link
              href="/Login"
              className=" inline-block items-center rounded-md bg-red-600 px-8 py-4 text-center font-semibold text-white lg:mr-8 hover:bg-red-700 transition-transform duration-300">
              Start Quizzing
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
