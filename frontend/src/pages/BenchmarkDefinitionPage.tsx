import BenchmarkForm from "../components/BenchmarkForm";

function BenchmarkDefinitionPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] px-8 py-2">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white p-10 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-4">
            Define Benchmark Scope
          </h2>
          <BenchmarkForm />
        </div>
      </div>
    </div>
  );
}

export default BenchmarkDefinitionPage;
