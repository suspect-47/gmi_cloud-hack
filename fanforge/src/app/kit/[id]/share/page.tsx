export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <h1 className="text-display text-deep-orange mb-2">FanForge</h1>
          <p className="text-text-secondary font-body">
            AI-Generated World Cup 2026 Fan Kit
          </p>
        </div>

        <div className="card p-8 mb-6">
          <p className="text-text-secondary font-body mb-4">
            Kit ID: <code className="text-xs bg-cream px-2 py-0.5 rounded">{id}</code>
          </p>
          <p className="text-sm text-text-tertiary font-body">
            Full kit view coming soon. Share this link with friends!
          </p>
        </div>

        <footer className="text-xs text-text-tertiary font-body">
          Powered by RocketRide &times; GMI Cloud &times; Google AI Studio
        </footer>
      </div>
    </div>
  );
}
