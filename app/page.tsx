"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [weather, setWeather] = useState<"맑음" | "비" | "눈">("비");
  const [money, setMoney] = useState<number>(8000);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>("init");

  // Determine active branch and food
  let food: "따뜻한 짬뽕 🍜" | "맛있는 치킨 🍗" | "간단한 삼각김밥 🍙" = "따뜻한 짬뽕 🍜";
  let activeBranch = "";

  if (weather === "비") {
    food = "따뜻한 짬뽕 🍜";
    activeBranch = "if";
  } else if (money >= 10000) {
    food = "맛있는 치킨 🍗";
    activeBranch = "elif";
  } else {
    food = "간단한 삼각김밥 🍙";
    activeBranch = "else";
  }

  // Trigger animations when states change
  useEffect(() => {
    setActiveStep("change");
    const timer = setTimeout(() => setActiveStep("run"), 150);
    return () => clearTimeout(timer);
  }, [weather, money]);

  const rawPythonCode = `# 1. 변수 (Variable): 정보를 저장하는 상자
weather = "${weather}"  # 날씨 ("맑음", "비", "눈")
money = ${money}   # 내 지갑의 돈

# 2. 조건문 (If Statement): 조건에 따른 선택
if weather == "비":
    food = "따뜻한 짬뽕 🍜"
elif money >= 10000:
    food = "맛있는 치킨 🍗"
else:
    food = "간단한 삼각김밥 🍙"

print("오늘의 추천 메뉴:", food)`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawPythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // UI state representation for card rendering
  const foodDetails = {
    "따뜻한 짬뽕 🍜": {
      name: "따뜻한 짬뽕",
      emoji: "🍜",
      color: "from-orange-500 to-red-600",
      glow: "rgba(239, 68, 68, 0.4)",
      desc: "비 오는 날에는 역시 칼칼하고 따뜻한 국물이 최고죠! 조건문 `weather == '비'`가 참(True)이 되어 선택되었습니다.",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-red-950/10 to-transparent",
    },
    "맛있는 치킨 🍗": {
      name: "맛있는 치킨",
      emoji: "🍗",
      color: "from-amber-400 to-yellow-600",
      glow: "rgba(245, 158, 11, 0.4)",
      desc: "날씨는 비가 안 오지만, 지갑에 만 원 이상(money >= 10000)이 있어 바삭한 치킨을 먹을 수 있습니다!",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-amber-950/10 to-transparent",
    },
    "간단한 삼각김밥 🍙": {
      name: "간단한 삼각김밥",
      emoji: "🍙",
      color: "from-slate-400 to-slate-700",
      glow: "rgba(100, 116, 139, 0.4)",
      desc: "비도 안 오고 지갑도 가볍다면 삼각김밥이 든든한 친구죠. 모든 조건이 충족되지 않아 `else` 분기가 실행되었습니다.",
      bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/20 via-zinc-950/10 to-transparent",
    },
  }[food];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

      <header className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              학부생을 위한 파이썬 코딩 입문 🐍
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400">
              Python Vibe Coding Simulator
            </h1>
            <p className="mt-3 text-slate-400 text-base lg:text-lg max-w-2xl">
              실시간으로 변수와 조건을 조작해 보며 파이썬의 가장 중요한 기초 개념인{" "}
              <strong className="text-indigo-300">변수(Variable)</strong>와{" "}
              <strong className="text-indigo-300">조건문(If Statement)</strong>의 원리를 직관적으로 이해해 봅시다.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 active:scale-95 transition text-sm font-medium text-slate-300 hover:text-white"
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-400">복사 완료!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>파이썬 코드 복사하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* LEFT COLUMN: IDE/Editor Visualizer */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
            {/* Header bar of IDE */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-500 ml-2">menu_recommend.py</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold">Live Visualizer</span>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto flex-1 flex flex-col justify-center bg-slate-900/90 backdrop-blur-sm">
              <div className="space-y-1">
                {/* Line 1 (Comment) */}
                <div className="flex items-start select-none py-0.5 opacity-60">
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs mt-1">1</span>
                  <span className="text-slate-500"># 1. 변수 (Variable): 정보를 저장하는 상자</span>
                </div>

                {/* Line 2 (weather var) */}
                <div className={`flex items-center py-1 rounded-lg transition-all duration-300 ${activeStep === "run" ? "bg-slate-850/50" : ""}`}>
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">2</span>
                  <div className="flex-1 flex flex-wrap items-center gap-x-1">
                    <span className="text-sky-400">weather</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-amber-300 font-bold transition-all duration-300 scale-105 bg-amber-300/10 px-1.5 py-0.5 rounded border border-amber-300/25">
                      "{weather}"
                    </span>
                    <span className="text-slate-500 text-xs ml-3 sm:inline hidden"># 날씨 ("맑음", "비", "눈")</span>
                    <span className="ml-auto text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded font-sans mr-2">
                      변수 weather 설정됨
                    </span>
                  </div>
                </div>

                {/* Line 3 (money var) */}
                <div className={`flex items-center py-1 rounded-lg transition-all duration-300 ${activeStep === "run" ? "bg-slate-850/50" : ""}`}>
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">3</span>
                  <div className="flex-1 flex flex-wrap items-center gap-x-1">
                    <span className="text-sky-400">money</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-emerald-300 font-bold transition-all duration-300 scale-105 bg-emerald-300/10 px-1.5 py-0.5 rounded border border-emerald-300/25">
                      {money.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-xs ml-3 sm:inline hidden"># 내 지갑의 돈 (원)</span>
                    <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-sans mr-2">
                      변수 money 설정됨
                    </span>
                  </div>
                </div>

                {/* Line 4 (Empty) */}
                <div className="flex items-start select-none py-0.5">
                  <span className="w-8 text-right pr-4 text-slate-700 text-xs">4</span>
                  <span></span>
                </div>

                {/* Line 5 (Comment) */}
                <div className="flex items-start select-none py-0.5 opacity-60">
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs mt-1">5</span>
                  <span className="text-slate-500"># 2. 조건문 (If Statement): 조건에 따른 선택</span>
                </div>

                {/* Line 6 (if weather == "비":) */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "if"
                      ? "bg-amber-500/15 border-l-4 border-amber-400 pl-1"
                      : "opacity-40"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">6</span>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-400 font-bold">if</span>{" "}
                      <span className="text-sky-400">weather</span>{" "}
                      <span className="text-slate-400">==</span>{" "}
                      <span className="text-amber-300">"비"</span>:
                    </div>
                    {activeBranch === "if" && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-sans mr-2 animate-pulse">
                        참 (True) 🌧️ 이므로 실행!
                      </span>
                    )}
                    {activeBranch !== "if" && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-sans mr-2">
                        거짓 (False) ❌
                      </span>
                    )}
                  </div>
                </div>

                {/* Line 7 (food = "따뜻한 짬뽕 🍜") */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "if"
                      ? "bg-emerald-500/10 pl-1"
                      : "opacity-45"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">7</span>
                  <div>
                    <span className="pl-6 text-sky-400">food</span>{" "}
                    <span className="text-slate-400">=</span>{" "}
                    <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-1 rounded">"따뜻한 짬뽕 🍜"</span>
                  </div>
                </div>

                {/* Line 8 (elif money >= 10000:) */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "elif"
                      ? "bg-amber-500/15 border-l-4 border-amber-400 pl-1"
                      : "opacity-40"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">8</span>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-400 font-bold">elif</span>{" "}
                      <span className="text-sky-400">money</span>{" "}
                      <span className="text-slate-400">&gt;=</span>{" "}
                      <span className="text-emerald-300">10000</span>:
                    </div>
                    {activeBranch === "elif" && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-sans mr-2 animate-pulse">
                        참 (True) 🍗 이므로 실행!
                      </span>
                    )}
                    {weather === "비" && (
                      <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-sans mr-2">
                        건너뜀 (위에서 이미 처리됨)
                      </span>
                    )}
                    {weather !== "비" && activeBranch !== "elif" && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-sans mr-2">
                        거짓 (False: {money} &lt; 10000)
                      </span>
                    )}
                  </div>
                </div>

                {/* Line 9 (food = "맛있는 치킨 🍗") */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "elif"
                      ? "bg-emerald-500/10 pl-1"
                      : "opacity-45"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">9</span>
                  <div>
                    <span className="pl-6 text-sky-400">food</span>{" "}
                    <span className="text-slate-400">=</span>{" "}
                    <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-1 rounded">"맛있는 치킨 🍗"</span>
                  </div>
                </div>

                {/* Line 10 (else:) */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "else"
                      ? "bg-amber-500/15 border-l-4 border-amber-400 pl-1"
                      : "opacity-40"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">10</span>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-400 font-bold">else</span>:
                    </div>
                    {activeBranch === "else" && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-sans mr-2 animate-pulse">
                        모든 조건이 거짓이므로 실행! 🍙
                      </span>
                    )}
                    {activeBranch !== "else" && (
                      <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-sans mr-2">
                        건너뜀 (위에서 이미 처리됨)
                      </span>
                    )}
                  </div>
                </div>

                {/* Line 11 (food = "간단한 삼각김밥 🍙") */}
                <div
                  className={`flex items-center py-1 rounded-lg transition-all duration-300 ${
                    activeBranch === "else"
                      ? "bg-emerald-500/10 pl-1"
                      : "opacity-45"
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">11</span>
                  <div>
                    <span className="pl-6 text-sky-400">food</span>{" "}
                    <span className="text-slate-400">=</span>{" "}
                    <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-1 rounded">"간단한 삼각김밥 🍙"</span>
                  </div>
                </div>

                {/* Line 12 (Empty) */}
                <div className="flex items-start select-none py-0.5">
                  <span className="w-8 text-right pr-4 text-slate-700 text-xs">12</span>
                  <span></span>
                </div>

                {/* Line 13 (print statement) */}
                <div className={`flex items-center py-1 rounded-lg transition-all duration-300 ${activeStep === "run" ? "bg-indigo-500/10 font-bold" : ""}`}>
                  <span className="w-8 text-right pr-4 text-slate-600 text-xs select-none">13</span>
                  <div>
                    <span className="text-pink-400">print</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-emerald-300">"오늘의 추천 메뉴:"</span>
                    <span className="text-slate-400">,</span> <span className="text-sky-400">food</span>
                    <span className="text-slate-400">)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info banner inside code IDE */}
            <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>UTF-8</span>
              <span>Python 3.10</span>
              <span>Tab Size: 4</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Controls & Simulation Result */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Controls Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              변수 값 조절기 (Variables Control)
            </h2>

            {/* Weather Input (weather) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                날씨 변수 (<span className="text-amber-300 font-mono">weather</span>)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "맑음", icon: "☀️", label: "맑음" },
                  { id: "비", icon: "🌧️", label: "비" },
                  { id: "눈", icon: "❄️", label: "눈" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWeather(item.id as "맑음" | "비" | "눈")}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-semibold transition-all ${
                      weather === item.id
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 scale-[1.03]"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Money Input (money) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  금액 변수 (<span className="text-emerald-300 font-mono">money</span>)
                </label>
                <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {money.toLocaleString()}원
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="1000"
                value={money}
                onChange={(e) => setMoney(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                <span>0원</span>
                <span>10,000원 (기준점)</span>
                <span>20,000원</span>
              </div>
            </div>
          </div>

          {/* Dynamic Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
            {/* Visual background glow reflecting current choice */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-all duration-500"
              style={{ backgroundColor: foodDetails.glow }}
            ></div>

            <div className={`relative z-10 ${foodDetails.bgPattern} -m-6 p-6 rounded-t-2xl border-b border-slate-800/50 flex-1 flex flex-col justify-center`}>
              <div className="text-center">
                {/* Bouncing Emoji with customized glow shadow */}
                <div
                  className="inline-block text-7xl mb-4 animate-bounce duration-1000 hover:scale-110 transition-transform cursor-pointer"
                  style={{ textShadow: `0 0 30px ${foodDetails.glow}` }}
                >
                  {foodDetails.emoji}
                </div>
                <h3 className={`text-2xl font-black bg-gradient-to-r ${foodDetails.color} bg-clip-text text-transparent`}>
                  {foodDetails.name}
                </h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-sm mx-auto font-sans">
                  {foodDetails.desc}
                </p>
              </div>
            </div>

            {/* Simulated Live Terminal */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-xs mt-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[10px] text-slate-500 uppercase tracking-widest">
                <span>Console Output</span>
                <span className="text-emerald-500 animate-pulse">● Running</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <p className="text-slate-500">&gt;&gt;&gt; python menu_recommend.py</p>
                <p className="text-indigo-400">
                  오늘의 추천 메뉴: <span className="font-bold text-white underline decoration-2 decoration-indigo-400">{food}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BOTTOM SECTION: Concept Explainer */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2.5">
          <span className="text-indigo-400 font-extrabold">💡</span>
          수업용 개념 포인트 (Variables & Conditionals Explained)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Variables */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition duration-300 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 text-3xl font-extrabold text-slate-800">01</div>
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              변수 (Variable) 개념
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              변수는 <strong>"데이터(값)를 담는 이름표가 붙은 상자"</strong>입니다.
              <br />
              코드에서 <code className="bg-slate-950 px-1.5 py-0.5 rounded text-sky-300 text-xs">weather = "{weather}"</code>와 
              같이 작성하면, <code className="text-sky-300">weather</code>라는 상자에 문자열 값인 
              <span className="text-amber-300 font-semibold"> "{weather}"</span>를 집어넣게 됩니다.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
              <div className="text-center flex-1">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-mono">Variable Name</span>
                <span className="text-sky-400 font-mono font-bold text-sm bg-sky-400/10 px-2.5 py-1 rounded border border-sky-400/20">weather</span>
              </div>
              <div className="text-slate-600 text-xl font-bold">➔</div>
              <div className="text-center flex-1">
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-mono">Stored Value</span>
                <span className="text-amber-300 font-mono font-bold text-sm bg-amber-300/10 px-2.5 py-1 rounded border border-amber-300/20">"{weather}"</span>
              </div>
            </div>
          </div>

          {/* Card 2: Conditionals */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition duration-300 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 text-3xl font-extrabold text-slate-800">02</div>
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              조건문 (If Statement) 개념
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              조건문은 <strong>"조건에 따라 코드의 실행 방향을 결정하는 갈림길"</strong>입니다.
              <br />
              컴퓨터는 위에서 아래로 한 줄씩 코드를 실행하다가, 조건이 <span className="text-emerald-400 font-bold">참(True)</span>이 되는 분기를 발견하면 그 아래 안쪽으로 들여쓰기된 코드만 실행하고 나머지는 통째로 건너뜁니다.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-850">
              <div className="flex flex-col gap-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${weather === "비" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-500"}`}>1</span>
                  <span className={weather === "비" ? "text-slate-200" : "text-slate-500"}>비가 오나요? ➔ {weather === "비" ? "예 (짬뽕 결정!)" : "아니오"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${weather !== "비" && money >= 10000 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-500"}`}>2</span>
                  <span className={weather !== "비" && money >= 10000 ? "text-slate-200" : "text-slate-500"}>지갑에 만 원 이상 있나요? ➔ {weather !== "비" && money >= 10000 ? "예 (치킨 결정!)" : "아니오"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${weather !== "비" && money < 10000 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-500"}`}>3</span>
                  <span className={weather !== "비" && money < 10000 ? "text-slate-200" : "text-slate-500"}>나머지 경우 ➔ 삼각김밥 결정!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
