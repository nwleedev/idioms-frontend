import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import useRelatedIdioms from "~/hooks/useRelatedIdioms";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Example from "~/components/Example";
import Guard from "~/components/Guard";
import Logo from "~/components/Logo";
import Toggle from "~/components/Toggle";
import Translate from "~/components/Translate";
import useSpeechContext from "~/hooks/useSpeechContext";
import { Idiom } from "~/types/idiom";
import style from "./Idiom.css?url";

export const css = [{ rel: "stylesheet", href: style }];

export interface IdiomPageProps {
  idiom?: Idiom;
}

const IdiomPage = (props: IdiomPageProps) => {
  const { idiom } = props;
  const navigate = useNavigate();
  const { idioms = [] } = useRelatedIdioms({ idiomId: idiom?.id });
  const titleRef = useRef(null as HTMLDivElement | null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { hasWordClick, onToggle } = useSpeechContext();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isSame = entry.target.isSameNode(titleRef.current);
          if (isSame) {
            setIsIntersecting(entry.isIntersecting);
          }
        });
      },
      { rootMargin: "0px" }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <Guard when={!!idiom}>
        <section
          style={{
            backgroundImage: `url("https://static.useidioms.com/${idiom?.thumbnail}")`,
            backgroundPosition: "top",
          }}
          className="max-w-[820px] w-full h-[100vh] object-cover fixed top-0 left-0 right-0 mx-auto"
        />
      </Guard>
      <Guard when={isIntersecting}>
        <div className="max-w-[820px] w-full fixed top-0 left-0 right-0 mx-auto z-10">
          <button onClick={() => navigate(-1)} className="m-4">
            <ChevronLeftIcon className="text-black" width={32} height={32} />
          </button>
        </div>
      </Guard>
      <Guard when={!isIntersecting}>
        <section className="fixed top-0 left-0 right-0 bottom-auto mx-auto z-10 max-w-[820px] bg-slate-50 py-2 px-8 flex items-center border-b-2">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftIcon
              className="m-1 text-black"
              width={24}
              height={24}
            />
          </button>
          <h2 className="text-xl font-medium font-Work_Sans tracking-tight w-[50%] truncate">
            {idiom?.idiom}
          </h2>
        </section>
      </Guard>
      <div className="Idiom w-full max-w-[820px] mx-auto pt-[320px] pb-[320px] shadow relative">
        <div className="h-[1px] bg-transparent w-full" ref={titleRef}></div>
        <main className="w-full px-4 rounded bg-slate-50">
          <section className="w-full px-2 py-6 rounded sm:px-6 gap-y-2">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold font-Work_Sans">
                {idiom?.idiom}
              </h1>
              <Translate
                tag="h2"
                className="text-2xl font-semibold text-gray-700"
              >
                {idiom?.idiom}
              </Translate>
            </div>
            <div className="flex flex-col">
              <h3 className="font-light text-gray-500">
                {idiom?.meaningBrief}
              </h3>
              <Translate className="font-light text-gray-500">
                {idiom?.meaningBrief}
              </Translate>
            </div>
            <div className="flex flex-col mt-2 gap-y-1">
              <p className="font-light">{idiom?.meaningFull}</p>
              <Translate
                tag="p"
                className="font-light text-gray-500 font-Work_Sans"
              >
                {idiom?.meaningFull}
              </Translate>
            </div>
            <div className="w-full max-w-full my-2 rounded">
              <Guard when={!!idiom}>
                <div
                  style={{
                    backgroundImage: `url("https://static.useidioms.com/${idiom?.thumbnail}")`,
                  }}
                  className="bg-center"
                >
                  <div className=" backdrop-blur-[50px]">
                    <img
                      src={`https://static.useidioms.com/${idiom?.thumbnail}`}
                      alt={`Background blur of ${idiom?.idiom}`}
                      className="max-w-[400px] w-full h-[auto] mx-auto object-contain"
                    />
                  </div>
                </div>
              </Guard>
            </div>
            <div className="flex flex-col my-2 gap-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold font-Work_Sans">
                  Use cases
                </h2>
                <div className="flex items-center gap-x-1">
                  <span className="text-xs">Word Click</span>
                  <Toggle isChecked={hasWordClick} onClick={() => onToggle()} />
                </div>
              </div>
              <div className="grid grid-cols-1 border-gray-900 divide-y">
                {idiom?.examples.map((example, index) => {
                  return (
                    <Example
                      example={{ content: example, index, idiomId: idiom.id }}
                      key={`example:${example.slice(0, 20)}:${index}`}
                    />
                  );
                })}
              </div>
            </div>
          </section>
          <section className="flex flex-col px-2 py-6 sm:px-6 gap-y-3">
            {idioms?.map((idiom) => {
              const key = `related:${idiom.id}`;
              return (
                <Link key={key} to={`/${idiom.id}`} replace={true}>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={`https://static.useidioms.com/${idiom?.thumbnail}`}
                      alt={`Thumbnail of ${idiom.idiom}`}
                      className="w-[100px] h-[100px] shadow-sm"
                    />
                    <div className="flex flex-col justify-start h-full overflow-hidden">
                      <h3 className="text-xl font-semibold font-Work_Sans">
                        {idiom.idiom}
                      </h3>
                      <p className="mt-1 text-sm font-light text-gray-900 break-words align-bottom overflow-ellipsis line-clamp-1">
                        {idiom.meaningBrief}
                      </p>
                      <p className="text-sm font-light font-Work_Sans text-gray-500 mt-0.5 line-clamp-2">
                        {idiom.meaningFull}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        </main>
        <div className="px-6 my-4">
          <Logo className="w-[145px]" />
        </div>
      </div>
    </>
  );
};

export default IdiomPage;
