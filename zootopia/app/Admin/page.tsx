// app/admin/page.tsx
import AdminClient from "./adminClient";

// Panel admina zawsze powinien odzwierciedlać najświeższe dane z bazy
export const dynamic = "force-dynamic"; 

export default async function AdminPage() {
  // Cała logika pobierania, mapowania i cache'owania struktur 
  // została przeniesiona do dedykowanych endpointów API (/api/...) 
  // oraz wewnętrznych stanów komponentów klienckich.
  return <AdminClient />;
}