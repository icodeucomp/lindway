import { Background } from "@/components";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 justify-center items-center min-h-screen">
        <span className="text-3xl">Template NEXT.JS Typescript</span>
        <ol className="list-inside list-disc text-sm space-y-1">
          <li>
            Get started by editing <code className="bg-light/20 px-1 py-0.5 rounded font-semibold">src/app/page.tsx</code>.
          </li>
          <li>Use some of the components already created</li>
          <li>There are also some custom hooks ready to use</li>
          <li>Adding file in components if you want split the code.</li>
          <li>Save and see your changes instantly.</li>
        </ol>
      </main>
      <Background src="https://wallpaperaccess.com/full/3518004.jpg" alt="test" className="min-h-500" imgClassName="object-center">
        <h1 className="text-4xl text-lime-500">Helmy</h1>
      </Background>
    </>
  );
}
