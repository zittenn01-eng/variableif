"use client";

import { useState, useEffect } from "react";

interface ConditionalBranch {
  id: string;
  type: "if" | "elif" | "else";
  condition: {
    variable: "weather" | "money" | "";
    operator: "==" | "!=" | ">=" | "<=" | ">" | "<" | "";
    value: string;
  };
  food: string;
}

export default function Home() {
  const [weather, setWeather] = useState<"맑음" | "비" | "눈">("비");
  const [money, setMoney] = useState<number>(8000);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>("init");
  
  // Interactive mode vs code editing mode
  const [editMode, setEditMode] = useState<"visual" | "code">("visual");

  const [branches, setBranches] = useState<ConditionalBranch[]>([
    {
      id: "branch-1",
      type: "if",
      condition: { variable: "weather", operator: "==", value: "비" },
      food: "따뜻한 짬뽕 🍜",
    },
    {
      id: "branch-2",
      type: "elif",
      condition: { variable: "money", operator: ">=", value: "10000" },
      food: "맛있는 치킨 🍗",
    },
    {
      id: "branch-3",
      type: "else",
      condition: { variable: "", operator: "", value: "" },
      food: "간단한 삼각김밥 🍙",
    },
  ]);

  const [codeText, setCodeText] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);

  // Helper to generate code from branches
  const generatePythonCodeStr = (
    currentBranches: ConditionalBranch[],
    wVal: string,
    mVal: number
  ) => {
    let code = `# 1. 변수 (Variable): 정보를 저장하는 상자\n`;
    code += `weather = "${wVal}"  # 날씨 ("맑음", "비", "눈")\n`;
    code += `money = ${mVal}   # 내 지갑의 돈\n\n`;
    code += `# 2. 조건문 (If Statement): 조건에 따른 선택\n`;

    currentBranches.forEach((b) => {
      if (b.type === "if") {
        const valStr = b.condition.variable === "weather" ? `"${b.condition.value}"` : b.condition.value;
        code += `if ${b.condition.variable} ${b.condition.operator} ${valStr}:\n`;
        code += `    food = "${b.food}"\n`;
      } else if (b.type === "elif") {
        const valStr = b.condition.variable === "weather" ? `"${b.condition.value}"` : b.condition.value;
        code += `elif ${b.condition.variable} ${b.condition.operator} ${valStr}:\n`;
        code += `    food = "${b.food}"\n`;
      } else if (b.type === "else") {
        code += `else:\n`;
        code += `    food = "${b.food}"\n`;
      }
    });

    code += `\nprint("오늘의 추천 메뉴:", food)`;
    return code;
  };

  // Sync branches to codeText when branches change (only in visual mode)
  useEffect(() => {
    if (editMode === "visual") {
      setCodeText(generatePythonCodeStr(branches, weather, money));
      setParseError(null);
    }
  }, [branches, editMode, weather, money]);

  // Sync weather/money changes to codeText
  useEffect(() => {
    if (editMode === "code") {
      // Re-generate code but preserve the structure if we can, or just update the variable lines
      const lines = codeText.split("\n");
      const updatedLines = lines.map(line => {
        if (line.startsWith("weather =")) {
          return `weather = "${weather}"  # 날씨 ("맑음", "비", "눈")`;
        }
        if (line.startsWith("money =")) {
          return `money = ${money}   # 내 지갑의 돈`;
        }
        return line;
      });
      setCodeText(updatedLines.join("\n"));
    }
  }, [weather, money]);

  // Parse code input on changes in code mode
  const handleCodeChange = (newVal: string) => {
    setCodeText(newVal);

    // Try parsing
    try {
      const lines = newVal.split("\n");
      const parsedBranches: ConditionalBranch[] = [];
      let currentBranch: Partial<ConditionalBranch> | null = null;
      let hasIf = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#")) continue;
        if (line.startsWith("weather =") || line.startsWith("money =") || line.startsWith("print(")) {
          continue;
        }

        const ifMatch = line.match(/^(if|elif)\s+(weather|money)\s*(==|!=|>=|<=|>|<)\s*(["']([^"']*)["']|(\d+))\s*:/);
        const elseMatch = line.match(/^else\s*:/);
        const foodMatch = line.match(/^food\s*=\s*["']([^"']*)["']/);

        if (ifMatch) {
          if (currentBranch) {
            if (!currentBranch.food) currentBranch.food = "추천 메뉴 🍲";
            parsedBranches.push(currentBranch as ConditionalBranch);
          }
          const type = ifMatch[1] as "if" | "elif";
          if (type === "if") hasIf = true;
          const variable = ifMatch[2] as "weather" | "money";
          const operator = ifMatch[3] as any;
          const value = ifMatch[5] !== undefined ? ifMatch[5] : ifMatch[6];

          currentBranch = {
            id: `parsed-${i}-${Math.random().toString(36).substr(2, 4)}`,
            type,
            condition: { variable, operator, value },
            food: "",
          };
        } else if (elseMatch) {
          if (currentBranch) {
            if (!currentBranch.food) currentBranch.food = "추천 메뉴 🍲";
            parsedBranches.push(currentBranch as ConditionalBranch);
          }
          currentBranch = {
            id: `parsed-${i}-${Math.random().toString(36).substr(2, 4)}`,
            type: "else",
            condition: { variable: "", operator: "", value: "" },
            food: "",
          };
        } else if (foodMatch) {
          if (currentBranch) {
            currentBranch.food = foodMatch[1];
          }
        }
      }

      if (currentBranch) {
        if (!currentBranch.food) currentBranch.food = "추천 메뉴 🍲";
        parsedBranches.push(currentBranch as ConditionalBranch);
      }

      if (parsedBranches.length === 0) {
        setParseError("파이썬 조건문 구조(if 등)를 찾을 수 없습니다.");
        return;
      }

      if (parsedBranches[0].type !== "if") {
        setParseError("첫 번째 조건문은 반드시 'if'로 시작해야 합니다.");
        return;
      }

      // Check double else or else not at the end
      const elseIndices = parsedBranches.map((b, idx) => b.type === "else" ? idx : -1).filter(idx => idx !== -1);
      if (elseIndices.length > 0 && elseIndices[elseIndices.length - 1] !== parsedBranches.length - 1) {
        setParseError("'else:'는 반드시 조건문의 가장 마지막에 위치해야 합니다.");
        return;
      }
      if (elseIndices.length > 1) {
        setParseError("'else:'는 한 번만 사용할 수 있습니다.");
        return;
      }

      // Everything OK
      setBranches(parsedBranches);
      setParseError(null);
    } catch (e: any) {
      setParseError("구문 오류가 있습니다: " + e.message);
    }
  };

  // Evaluate execution flow
  const { activeBranchId, food, evaluatedBranches } = evaluateBranches(branches, weather, money);

  // Trigger animations when states change
  useEffect(() => {
    setActiveStep("change");
    const timer = setTimeout(() => setActiveStep("run"), 150);
    return () => clearTimeout(timer);
  }, [weather, money, branches]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Visual Builder Actions
  const addElifBranch = () => {
    const newBranch: ConditionalBranch = {
      id: `branch-${Math.random().toString(36).substr(2, 9)}`,
      type: "elif",
      condition: { variable: "money", operator: ">=", value: "5000" },
      food: "김밥 🍙",
    };
    // Insert before else if else exists, otherwise at the end
    const elseIndex = branches.findIndex(b => b.type === "else");
    if (elseIndex !== -1) {
      const updated = [...branches];
      updated.splice(elseIndex, 0, newBranch);
      setBranches(updated);
    } else {
      setBranches([...branches, newBranch]);
    }
  };

  const deleteBranch = (id: string) => {
    // Keep at least if and else if possible
    const branch = branches.find(b => b.id === id);
    if (branch?.type === "if") {
      alert("첫 번째 'if' 조건문은 삭제할 수 없습니다.");
      return;
    }
    if (branch?.type === "else") {
      alert("마지막 'else' 조건문은 삭제할 수 없습니다.");
      return;
    }
    setBranches(branches.filter(b => b.id !== id));
  };

  const moveBranch = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= branches.length) return;

    // Boundary rules: 'if' must stay at 0, 'else' must stay at the end
    if (branches[index].type === "if" || branches[newIndex].type === "if") return;
    if (branches[index].type === "else" || branches[newIndex].type === "else") return;

    const updated = [...branches];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setBranches(updated);
  };

  const updateBranchField = (id: string, field: string, value: any) => {
    setBranches(
      branches.map((b) => {
        if (b.id === id) {
          if (field === "variable") {
            return {
              ...b,
              condition: {
                ...b.condition,
                variable: value,
                operator: value === "weather" ? "==" : ">=",
                value: value === "weather" ? "비" : "10000",
              },
            };
          }
          if (field.startsWith("condition.")) {
            const subField = field.split(".")[1];
            return {
              ...b,
              condition: {
                ...b.condition,
                [subField]: value,
              },
            };
          }
          return { ...b, [field]: value };
        }
        return b;
      })
    );
  };

  // Helper to parse emojis and names
  const parseFoodInfo = (fullName: string) => {
    const emojiMatch = fullName.match(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : "🍴";
    const name = fullName.replace(emoji, "").trim() || "추천 음식";
    return { name, emoji };
  };

  const parsedFood = parseFoodInfo(food);
  
  // Decide visual card details
  const activeBranch = branches.find(b => b.id === activeBranchId);
  let foodDetails = {
    name: parsedFood.name,
    emoji: parsedFood.emoji,
    color: "from-indigo-400 to-indigo-600",
    glow: "rgba(99, 102, 241, 0.4)",
    desc: "조건식 평가 결과를 확인해 보세요.",
    bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950/10 to-transparent",
  };

  if (activeBranch) {
    const evalInfo = evaluatedBranches.find(eb => eb.id === activeBranch.id);
    if (activeBranch.type === "if") {
      foodDetails = {
        name: parsedFood.name,
        emoji: parsedFood.emoji,
        color: "from-orange-500 to-red-600",
        glow: "rgba(239, 68, 68, 0.4)",
        desc: `첫 번째 조건(if)이 참(True)이 되어 "${parsedFood.name}" 분기가 실행되었습니다.`,
        bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-red-950/10 to-transparent",
      };
    } else if (activeBranch.type === "elif") {
      foodDetails = {
        name: parsedFood.name,
        emoji: parsedFood.emoji,
        color: "from-amber-400 to-yellow-600",
        glow: "rgba(245, 158, 11, 0.4)",
        desc: `이전 조건은 거짓이었으나, 이번 조건(elif)이 참이 되어 "${parsedFood.name}" 분기가 실행되었습니다.`,
        bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-amber-950/10 to-transparent",
      };
    } else {
      foodDetails = {
        name: parsedFood.name,
        emoji: parsedFood.emoji,
        color: "from-slate-400 to-slate-700",
        glow: "rgba(148, 163, 184, 0.4)",
        desc: `앞선 모든 조건문이 만족하지 않아 else 분기가 최종 실행되어 "${parsedFood.name}" 분기가 선택되었습니다.`,
        bgPattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/20 via-zinc-950/10 to-transparent",
      };
    }
  }

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
            <p className="mt-3 text-slate-400 text-base lg:text-lg max-w-3xl">
              변수 값뿐만 아니라 **조건문(If-Elif-Else)의 구조**도 직접 바꾸어 보세요!
              조건의 순서, 부등호 방향, 새로운 조건을 추가/삭제하면서 시뮬레이션 결과를 실시간으로 확인해 봅시다.
            </p>
          </div>
          <div className="flex justify-center gap-3">
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
                  <span>최종 파이썬 코드 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* LEFT COLUMN: IDE/Editor & Interactive Builder */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Tab Selector */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setEditMode("visual")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                editMode === "visual"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>⚙️ 블록 조립기 (Visual Builder)</span>
            </button>
            <button
              onClick={() => setEditMode("code")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                editMode === "code"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>📝 파이썬 코드 직접 편집 (Direct Editor)</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[500px]">
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
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold">
                  {editMode === "visual" ? "Visual Mode" : "Code Editor Mode"}
                </span>
              </div>
            </div>

            {/* Visual Builder Mode */}
            {editMode === "visual" && (
              <div className="p-5 flex-1 flex flex-col justify-start bg-slate-900/90 gap-4 overflow-y-auto max-h-[600px]">
                <div className="text-xs text-slate-400 mb-2">
                  아래 조건문 블록들의 **순서(위/아래 화살표)**를 바꾸거나, **조건 추가/삭제**, 혹은 **변수/연산자/추천 메뉴**를 직접 수정해 보세요!
                </div>

                {branches.map((branch, index) => {
                  const evalInfo = evaluatedBranches.find(eb => eb.id === branch.id);
                  const isMatched = evalInfo?.result === true;
                  const isFailed = evalInfo?.result === false;
                  const isSkipped = evalInfo?.result === null;

                  return (
                    <div
                      key={branch.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isMatched
                          ? "bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/5"
                          : isSkipped
                          ? "bg-slate-900/30 border-slate-800/50 opacity-50"
                          : "bg-slate-950 border-slate-850"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            branch.type === "if" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                            branch.type === "elif" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                            "bg-slate-700/35 text-slate-300 border border-slate-700/40"
                          }`}>
                            {branch.type}
                          </span>

                          {/* Evaluation Status Badge */}
                          {isMatched && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                              참 (True) - 실행됨! ✅
                            </span>
                          )}
                          {isFailed && (
                            <span className="text-[10px] bg-red-500/10 text-red-400/80 border border-red-500/20 px-1.5 py-0.5 rounded">
                              거짓 (False) ❌
                            </span>
                          )}
                          {isSkipped && (
                            <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                              건너뜀 (이미 참이 발견됨)
                            </span>
                          )}
                        </div>

                        {/* Order & Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          {branch.type !== "if" && branch.type !== "else" && (
                            <>
                              <button
                                disabled={index <= 1}
                                onClick={() => moveBranch(index, "up")}
                                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition"
                                title="위로 이동"
                              >
                                ▲
                              </button>
                              <button
                                disabled={index >= branches.length - 2}
                                onClick={() => moveBranch(index, "down")}
                                className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition"
                                title="아래로 이동"
                              >
                                ▼
                              </button>
                              <button
                                onClick={() => deleteBranch(branch.id)}
                                className="p-1.5 rounded bg-rose-950/20 hover:bg-rose-950/50 border border-rose-900/30 text-rose-400 transition ml-2"
                                title="조건 삭제"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Branch Editor Controls */}
                      {branch.type !== "else" ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          {/* Condition Variable */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">비교 대상 변수</label>
                            <select
                              value={branch.condition.variable}
                              onChange={(e) => updateBranchField(branch.id, "variable", e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-sky-400 font-mono focus:outline-none focus:border-indigo-500"
                            >
                              <option value="weather">weather (날씨)</option>
                              <option value="money">money (지갑의 돈)</option>
                            </select>
                          </div>

                          {/* Condition Operator */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">비교 연산자</label>
                            <select
                              value={branch.condition.operator}
                              onChange={(e) => updateBranchField(branch.id, "condition.operator", e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-indigo-400 font-mono focus:outline-none focus:border-indigo-500"
                            >
                              {branch.condition.variable === "weather" ? (
                                <>
                                  <option value="==">== (같다)</option>
                                  <option value="!=">!= (다르다)</option>
                                </>
                              ) : (
                                <>
                                  <option value=">=">&gt;= (이상)</option>
                                  <option value="<=">&lt;= (이하)</option>
                                  <option value=">">&gt; (초과)</option>
                                  <option value="<">&lt; (미만)</option>
                                  <option value="==">== (같다)</option>
                                  <option value="!=">!= (다르다)</option>
                                </>
                              )}
                            </select>
                          </div>

                          {/* Condition Value */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">기준값 설정</label>
                            {branch.condition.variable === "weather" ? (
                              <select
                                value={branch.condition.value}
                                onChange={(e) => updateBranchField(branch.id, "condition.value", e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-indigo-500"
                              >
                                <option value="맑음">맑음</option>
                                <option value="비">비</option>
                                <option value="눈">눈</option>
                              </select>
                            ) : (
                              <input
                                type="number"
                                step="1000"
                                value={branch.condition.value}
                                onChange={(e) => updateBranchField(branch.id, "condition.value", e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-500"
                              />
                            )}
                          </div>

                          {/* Recommended Menu */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">추천 음식 (이모지 포함)</label>
                            <input
                              type="text"
                              value={branch.food}
                              onChange={(e) => updateBranchField(branch.id, "food", e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-indigo-500"
                              placeholder="추천 메뉴 적기 🍲"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          <div className="md:col-span-3 text-xs text-slate-500">
                            앞선 모든 조건문이 참이 아닐 때, 마지막에 무조건 실행되는 분기입니다.
                          </div>
                          {/* Recommended Menu for Else */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">추천 음식 (이모지 포함)</label>
                            <input
                              type="text"
                              value={branch.food}
                              onChange={(e) => updateBranchField(branch.id, "food", e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-indigo-500"
                              placeholder="추천 메뉴 적기 🍲"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Elif Button */}
                <button
                  onClick={addElifBranch}
                  className="mt-2 py-3 px-4 rounded-xl border border-dashed border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 bg-indigo-950/5 hover:bg-indigo-950/10 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>➕ 새로운 조건 분기 (elif) 추가하기</span>
                </button>
              </div>
            )}

            {/* Direct Code Editor Mode */}
            {editMode === "code" && (
              <div className="flex-1 flex flex-col bg-slate-900/90 relative">
                {parseError && (
                  <div className="bg-rose-950/40 border-b border-rose-800/30 px-4 py-2.5 text-xs text-rose-300 flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <span>{parseError}</span>
                  </div>
                )}
                <div className="p-3 text-[11px] text-slate-500 bg-slate-950/40 border-b border-slate-850 flex justify-between">
                  <span>변수 선언문과 print() 함수는 고정되며, 그 사이의 조건 구조를 수정해 보세요.</span>
                  <span className="text-amber-500/80">실시간 조건 파싱 활성화됨</span>
                </div>
                <textarea
                  value={codeText}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="flex-1 w-full p-5 font-mono text-sm leading-relaxed bg-slate-900/40 text-slate-300 focus:outline-none resize-none min-h-[400px]"
                  spellCheck="false"
                />
              </div>
            )}

            {/* Bottom info banner inside code IDE */}
            <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <span>UTF-8</span>
                <span>Python 3.10</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tab Size: 4</span>
                <span className="text-emerald-500/80">● Live Preview Sync</span>
              </div>
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
                <span>10,000원</span>
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
                {/* Bouncing Emoji */}
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
                  오늘의 추천 메뉴: <span className="font-bold text-white underline decoration-2 decoration-indigo-400">{food || "설정 없음"}</span>
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
          수업용 개념 포인트 (Variables & Conditionals)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Variables */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition duration-300 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 text-3xl font-extrabold text-slate-800">01</div>
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              조건문의 실행 흐름
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              조건문은 **위에서부터 아래 방향으로** 차례대로 평가합니다.
              만약 어느 한 조건이 **참(True)**이 되면, 그 분기의 코드가 실행되고 **나머지 모든 조건(elif, else)은 무시**한 채 조건문 블록을 빠져나옵니다.
              조건문 블록의 순서가 실행 결과에 결정적인 차이를 만드는 이유가 바로 이 때문입니다.
            </p>
          </div>

          {/* Card 2: Interactive Tasks */}
          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition duration-300 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4 text-3xl font-extrabold text-slate-800">02</div>
            <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              시뮬레이터 도전 과제 🎯
            </h3>
            <div className="text-slate-400 text-sm space-y-2 font-sans">
              <p>💡 **미션 1**: '지갑의 돈' 조건을 날씨 조건보다 위로 오게 순서를 바꿔 보세요. 그리고 날씨가 '비' 이고 돈이 '15,000원' 일 때 어떤 음식이 선택되나요?</p>
              <p>💡 **미션 2**: `elif` 분기를 하나 더 추가해서 지갑의 돈이 5,000원 이상일 때 맛있는 '라면 🍜'을 먹는 조건을 만들어 보세요.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple Python evaluation helper
function evaluateBranches(
  branches: ConditionalBranch[],
  weather: string,
  money: number
) {
  let activeBranchId: string | null = null;
  let food = "";
  const evaluatedBranches: { id: string; result: boolean | null }[] = [];
  let alreadyMatched = false;

  for (const branch of branches) {
    if (alreadyMatched) {
      evaluatedBranches.push({ id: branch.id, result: null });
      continue;
    }

    if (branch.type === "else") {
      activeBranchId = branch.id;
      food = branch.food;
      evaluatedBranches.push({ id: branch.id, result: true });
      alreadyMatched = true;
    } else {
      const { variable, operator, value } = branch.condition;
      let matched = false;
      const currentVal = variable === "weather" ? weather : money;
      const compareVal = variable === "weather" ? value : Number(value);

      if (variable === "weather") {
        if (operator === "==") matched = currentVal === compareVal;
        else if (operator === "!=") matched = currentVal !== compareVal;
      } else {
        const numVal = Number(currentVal);
        const compNum = Number(compareVal);
        if (!isNaN(numVal) && !isNaN(compNum)) {
          if (operator === "==") matched = numVal === compNum;
          else if (operator === "!=") matched = numVal !== compNum;
          else if (operator === ">=") matched = numVal >= compNum;
          else if (operator === "<=") matched = numVal <= compNum;
          else if (operator === ">") matched = numVal > compNum;
          else if (operator === "<") matched = numVal < compNum;
        }
      }

      if (matched) {
        activeBranchId = branch.id;
        food = branch.food;
        evaluatedBranches.push({ id: branch.id, result: true });
        alreadyMatched = true;
      } else {
        evaluatedBranches.push({ id: branch.id, result: false });
      }
    }
  }

  return { activeBranchId, food, evaluatedBranches };
}
