import { SignInBtn } from "@/components/SignInBtn";
import Logo from "@/public/Logo.png";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,rgba(194,87,87,0.18)_0%,rgba(11,10,10,0.92)_38%,rgba(11,10,10,1)_70%)]">
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[72px_72px] opacity-30" />
        <div className="pointer-events-none absolute left-1/2 -top-45 h-1054w-105anslate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(227,120,120,0.35),rgba(227,120,120,0)_60%)] blur-2xl animate-[glow-pulse_6s_ease-in-out_infinite]" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 text-sm text-muted">
        <div className="flex items-center gap-1  font-semibold text-foreground">
          <Image
            src={Logo}
            alt="logo"
            width={50}
            height={50}
            className="rounded-full size-15"
          />
          <span className="text-xl">Sparkworks</span>
        </div>

        <div className="flex items-center gap-3">
          <SignInBtn />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 flex-1 items-center justify-center mb-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-(--surface-glass) px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
              Event Management
              <span className="h-1 w-1 rounded-full bg-accent" />
              AI-assisted
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Blaize The Trail
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Sparkworks is the one stop platform for Nyala AI to quickly
                create, manage and execute flawless events. From keeping all
                resources in one place, to ensuring due dates are met and
                automating workflows, Sparkworks ensures we are able to focus on
                what is important. <strong>Making things happen.</strong>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-4xl border border-border bg-[linear-gradient(145deg,rgba(227,120,120,0.18),rgba(20,16,17,0.85))] shadow-[0_30px_80px_var(--shadow)]" />
            <div className="rounded-[28px] border border-border bg-surface p-6">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Live event control</span>
                <span className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
                  Klang Valley
                </span>
              </div>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-border bg-surface-2 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Tech Summit 2026
                      </p>
                      <p className="text-xs text-muted">
                        Run of show + delegate tracker
                      </p>
                    </div>
                    <span className="badge badge-sm border-none bg-[rgba(194,87,87,0.2)] text-accent">
                      Live
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Arrival flow</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-3">
                      <div className="h-2 w-[92%] rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-surface-2 p-4">
                    <p className="text-xs text-muted">Automation cues</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      26
                    </p>
                    <p className="text-xs text-muted">
                      Agentic handoffs queued
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-2 p-4">
                    <p className="text-xs text-muted">Resource pack</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      142
                    </p>
                    <p className="text-xs text-muted">Files ready for crew</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
