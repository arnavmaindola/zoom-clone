"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, EyeOff, LockKeyhole, UserRound, UsersRound, Video } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validCredentials = username === "Arnav" && password === "arnav123";

    if (!validCredentials) {
      setError("Invalid username or password");
      return;
    }

    sessionStorage.setItem("loggedInUser", username);
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f4f4f6] px-4 py-5 text-[#1d1d1f] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#e4e4e8] bg-white shadow-[0_16px_44px_rgba(16,24,40,0.08)] sm:min-h-[calc(100vh-64px)]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e4e4e8] px-5 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0e72ed] text-white">
              <Video size={17} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-normal">Meet</span>
          </div>
          <span className="text-sm text-[#6b6b70]">Welcome back</span>
        </header>

        <section className="grid flex-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
            <div className="w-full max-w-[390px]">
              <div className="mb-8">
                <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[#e8f1fd] text-[#0e72ed]">
                  <Video size={21} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <h1 className="text-[28px] font-semibold leading-tight tracking-normal">
                  Sign in to Meet
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#6b6b70]">
                  Use your account details to continue.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-[#313136]">
                    Username
                  </span>
                  <span className="flex h-11 items-center gap-2.5 rounded-lg border border-[#d6d6db] bg-white px-3 text-[#6b6b70] transition-colors focus-within:border-[#0e72ed] focus-within:ring-3 focus-within:ring-[#0e72ed]/12">
                    <UserRound size={17} strokeWidth={2} aria-hidden="true" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1d1d1f] outline-none placeholder:text-[#94949a]"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        setError("");
                      }}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-[#313136]">
                    Password
                  </span>
                  <span className="flex h-11 items-center gap-2.5 rounded-lg border border-[#d6d6db] bg-white px-3 text-[#6b6b70] transition-colors focus-within:border-[#0e72ed] focus-within:ring-3 focus-within:ring-[#0e72ed]/12">
                    <LockKeyhole size={17} strokeWidth={2} aria-hidden="true" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1d1d1f] outline-none placeholder:text-[#94949a]"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                    />
                    <button
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[#6b6b70] transition-colors hover:bg-[#f3f4f6] hover:text-[#3f3f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e72ed]/25"
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? (
                        <EyeOff size={17} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Eye size={17} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  </span>
                </label>

                {error ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-[#f5c2c0] bg-[#fdecec] px-3 py-2.5 text-[13px] text-[#b42318]"
                  >
                    {error}
                  </p>
                ) : null}

                <button
                  className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#0e72ed] text-sm font-semibold text-white transition-colors hover:bg-[#0b63d1] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0e72ed]/25"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          <div className="hidden bg-[#e8f1fd] p-8 lg:flex lg:items-center lg:justify-center">
            <div className="w-full max-w-[380px]">
              <div className="mb-8">
                <span className="text-sm font-semibold text-[#0e72ed]">Meet</span>
                <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-normal text-[#1d3a5f]">
                  Connect with your team
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5e7188]">
                  Everything you need to make each conversation feel effortless.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-4 rounded-xl border border-white/90 bg-white/80 p-4 shadow-[0_4px_12px_rgba(14,114,237,0.06)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e8f1fd] text-[#0e72ed]">
                    <Video size={19} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#284260]">Start instant meetings</h3>
                    <p className="mt-1 text-[13px] leading-5 text-[#687b91]">Create a meeting in seconds</p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-white/90 bg-white/80 p-4 shadow-[0_4px_12px_rgba(14,114,237,0.06)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf7f1] text-[#2d8a5f]">
                    <CalendarDays size={19} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#284260]">Schedule ahead</h3>
                    <p className="mt-1 text-[13px] leading-5 text-[#687b91]">Plan your next meeting</p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-white/90 bg-white/80 p-4 shadow-[0_4px_12px_rgba(14,114,237,0.06)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#fff1e8] text-[#d85d1b]">
                    <UsersRound size={19} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#284260]">Meet your participants</h3>
                    <p className="mt-1 text-[13px] leading-5 text-[#687b91]">Join with a simple meeting ID</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
