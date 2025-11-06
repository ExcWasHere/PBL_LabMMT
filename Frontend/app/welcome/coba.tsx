export function Coba() {
  return (
    <>
      <header className="text-blue-700 flex flex-col items-center justify-center gap-9 text-3xl m-10">
        💙✨Ini Header, tapi jelek✨💙
      </header>
      <main className="flex items-center justify-center pt-16 pb-4">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 bg-red-400">
            <p>Gimana ini bang, aku pusing😭</p>
          </nav>
          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Klik Saya Dong
          </button>
        </div>
      </main>
    </>
  );
}
