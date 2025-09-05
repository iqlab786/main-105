export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-12">
          <div className="p-4 card-soft">
            <h2 className="mb-2">Dashboard</h2>
            <p className="text-muted">Quick overview of your data sources and metadata actions.</p>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card card-soft p-3">
                  <h5>Connect a database</h5>
                  <p className="small text-muted">Create or select a MongoDB connection.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-soft p-3">
                  <h5>Ingest metadata</h5>
                  <p className="small text-muted">Scan collections and store metadata.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-soft p-3">
                  <h5>Enrich metadata</h5>
                  <p className="small text-muted">Run auto-PII and edit field info.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}