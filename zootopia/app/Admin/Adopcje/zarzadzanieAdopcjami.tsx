"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./adopcje.module.css";

import line from "@/app/Public/Images/line.svg";
import lupa from "@/app/Public/Images/lupa.svg";
import kosz from "@/app/Public/Images/kosz.svg";

// ── Typy ────────────────────────────────────────────────────────────────────

type AdoptionTab = "zwierzeta" | "wnioski";
type PetStatus = "available" | "reserved" | "adopted";
type ApplicationStatus = "pending" | "reviewing" | "approved" | "rejected";

interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  gender: "male" | "female";
  size: "small" | "medium" | "large";
  description: string;
  healthInfo: string;
  images: string[];
  status: PetStatus;
  tags: string[];
  createdAt: string;
}

interface Application {
  _id: string;
  petId: string;
  petName?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatAge(months: number): string {
  if (months < 12) return `${months} mies.`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (m === 0) return `${y} ${y === 1 ? "rok" : y < 5 ? "lata" : "lat"}`;
  return `${y} ${y === 1 ? "rok" : "lata"} ${m} mies.`;
}

const statusPetLabel: Record<PetStatus, string> = {
  available: "DOSTĘPNY",
  reserved: "ZAREZERWOWANY",
  adopted: "ADOPTOWANY",
};

const statusAppLabel: Record<ApplicationStatus, string> = {
  pending: "OCZEKUJE",
  reviewing: "W TRAKCIE",
  approved: "ZATWIERDZONY",
  rejected: "ODRZUCONY",
};

// ── Główny komponent ─────────────────────────────────────────────────────────

export default function ZarzadzanieAdopcjami() {
  const [tab, setTab] = useState<AdoptionTab>("zwierzeta");
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal: usuń zwierzę
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  // Modal: dodaj zwierzę
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "", breed: "", age: "", gender: "male",
    size: "medium", description: "", healthInfo: "", tags: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Modal: szczegóły wniosku
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchPets();
    fetchApplications();
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  async function fetchPets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pets");
      const data = await res.json();
      setPets(data.pets || []);
    } catch {
      console.error("Błąd pobierania zwierząt");
    } finally {
      setLoading(false);
    }
  }

  async function fetchApplications() {
    try {
      const res = await fetch("/api/admin/adoptions");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      console.error("Błąd pobierania wniosków");
    }
  }

  // ── Akcje: zwierzęta ───────────────────────────────────────────────────────

  async function handleDeletePet() {
    if (!petToDelete) return;
    try {
      await fetch(`/api/admin/pets/${petToDelete._id}`, { method: "DELETE" });
      setPets((prev) => prev.filter((p) => p._id !== petToDelete._id));
      setPetToDelete(null);
    } catch {
      alert("Błąd podczas usuwania zwierzęcia.");
    }
  }

  async function handleChangePetStatus(petId: string, newStatus: PetStatus) {
    try {
      await fetch(`/api/admin/pets/${petId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setPets((prev) =>
        prev.map((p) => (p._id === petId ? { ...p, status: newStatus } : p))
      );
    } catch {
      alert("Błąd zmiany statusu.");
    }
  }

  async function handleAddPet(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!newPet.name || !newPet.description || !newPet.age) {
      setAddError("Wypełnij wymagane pola: nazwa, wiek, opis.");
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch("/api/admin/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPet,
          age: Number(newPet.age),
          tags: newPet.tags.split(",").map((t) => t.trim()).filter(Boolean),
          isActive: true,
          status: "available",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPets((prev) => [data.pet, ...prev]);
      setShowAddModal(false);
      setNewPet({ name: "", breed: "", age: "", gender: "male", size: "medium", description: "", healthInfo: "", tags: "" });
    } catch {
      setAddError("Nie udało się dodać zwierzęcia.");
    } finally {
      setAddLoading(false);
    }
  }

  // ── Akcje: wnioski ─────────────────────────────────────────────────────────

  async function handleChangeAppStatus(appId: string, newStatus: ApplicationStatus) {
    try {
      await fetch(`/api/admin/adoptions/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
      if (selectedApp?._id === appId) {
        setSelectedApp((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch {
      alert("Błąd zmiany statusu wniosku.");
    }
  }

  // ── Filtrowanie ────────────────────────────────────────────────────────────

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.breed || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredApps = applications.filter((a) =>
    a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
    a.applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
    (a.petName || "").toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.prawa}>
      <div className={styles.content}>

        {/* Breadcrumb */}
        <div className={styles.sortowanie}>
          <span className={styles.administrator}>Administrator</span>
          <span className={styles.administrator}>{`>`}</span>
          <span className={styles.administrator}>Zarządzanie adopcjami</span>
        </div>

        {/* Tytuł + search + przycisk dodaj */}
        <div className={styles.tytul}>
          <div className={styles.tytulRow}>
            <div className={styles.pageTitle}>Zarządzanie adopcjami</div>
            <div className={styles.tytulActions}>
              {tab === "zwierzeta" && (
                <button className={styles.btnDodaj} onClick={() => setShowAddModal(true)}>
                  + Dodaj zwierzę
                </button>
              )}
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder={tab === "zwierzeta" ? "Szukaj zwierzęcia..." : "Szukaj wniosku..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <Image src={lupa} width={20} height={20} alt="Szukaj" className={styles.searchIcon} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} alt="" />
        </div>

        {/* Zakładki */}
        <div className={styles.sortowanieZamwie}>
          <div className={styles.tabRow}>
            <div
              className={styles.tabItem}
              style={{ opacity: tab === "zwierzeta" ? 1 : 0.45, cursor: "pointer" }}
              onClick={() => { setTab("zwierzeta"); setSearch(""); }}
            >
              <b>Zwierzęta</b>
              <b>({pets.length})</b>
            </div>
            <div
              className={styles.tabItem}
              style={{ opacity: tab === "wnioski" ? 1 : 0.45, cursor: "pointer" }}
              onClick={() => { setTab("wnioski"); setSearch(""); }}
            >
              <b>Wnioski adopcyjne</b>
              <b>({applications.length})</b>
            </div>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} alt="" />
        </div>

        {/* ── Lista zwierząt ── */}
        {tab === "zwierzeta" && (
          <>
            {loading && <div className={styles.emptyInfo}>Ładowanie...</div>}
            {!loading && filteredPets.length === 0 && (
              <div className={styles.emptyInfo}>Brak zwierząt w bazie.</div>
            )}
            {filteredPets.map((pet, i) => (
              <div key={pet._id}>
                <div className={styles.petRow}>
                  <div className={styles.petInfo}>
                    <div className={styles.petName}>{pet.name}</div>
                    <div className={styles.petMeta}>
                      {pet.breed || "Mieszaniec"} · {formatAge(pet.age)} ·{" "}
                      {pet.gender === "male" ? "Samiec" : "Samica"}
                    </div>
                  </div>
                  <div className={styles.petActions}>
                    <select
                      className={styles.statusSelect}
                      value={pet.status}
                      onChange={(e) => handleChangePetStatus(pet._id, e.target.value as PetStatus)}
                    >
                      <option value="available">Dostępny</option>
                      <option value="reserved">Zarezerwowany</option>
                      <option value="adopted">Adoptowany</option>
                    </select>
                    <b className={
                      pet.status === "available" ? styles.statusAvailable :
                      pet.status === "reserved" ? styles.statusReserved :
                      styles.statusAdopted
                    }>
                      {statusPetLabel[pet.status]}
                    </b>
                    <Image
                      src={kosz}
                      width={16}
                      height={18}
                      alt="Usuń"
                      style={{ cursor: "pointer" }}
                      onClick={() => setPetToDelete(pet)}
                    />
                  </div>
                </div>
                {i < filteredPets.length - 1 && (
                  <Image src={line} className={styles.dividerChild} alt="" />
                )}
              </div>
            ))}
          </>
        )}

        {/* ── Lista wniosków ── */}
        {tab === "wnioski" && (
          <>
            {filteredApps.length === 0 && (
              <div className={styles.emptyInfo}>Brak wniosków adopcyjnych.</div>
            )}
            {filteredApps.map((app, i) => (
              <div key={app._id}>
                <div className={styles.petRow}>
                  <div className={styles.petInfo}>
                    <div className={styles.petName}>{app.applicantName}</div>
                    <div className={styles.petMeta}>
                      {app.applicantEmail} · dot. {app.petName || app.petId}
                    </div>
                  </div>
                  <div className={styles.petActions}>
                    <b className={
                      app.status === "approved" ? styles.statusAvailable :
                      app.status === "rejected" ? styles.statusAdopted :
                      app.status === "reviewing" ? styles.statusReserved :
                      styles.statusPending
                    }>
                      {statusAppLabel[app.status]}
                    </b>
                    <span
                      className={styles.szczegoly}
                      onClick={() => setSelectedApp(app)}
                    >
                      SZCZEGÓŁY {`)`}
                    </span>
                  </div>
                </div>
                {i < filteredApps.length - 1 && (
                  <Image src={line} className={styles.dividerChild} alt="" />
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Modal: usuń zwierzę ── */}
      {petToDelete && (
        <div className={styles.overlay} onClick={() => setPetToDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setPetToDelete(null)}>✕</button>
            <div className={styles.modalTytul}>
              Czy na pewno chcesz usunąć zwierzę{" "}
              <span style={{ color: "#e74c3c" }}>{petToDelete.name}</span>?
            </div>
            <div className={styles.modalButtons}>
              <button className={styles.przyciskAnuluj} onClick={() => setPetToDelete(null)}>Anuluj</button>
              <button className={styles.przyciskUsun} onClick={handleDeletePet}>TAK, usuń</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: dodaj zwierzę ── */}
      {showAddModal && (
        <div className={styles.overlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setShowAddModal(false)}>✕</button>
            <div className={styles.modalTytul}>Dodaj nowe zwierzę</div>

            <form onSubmit={handleAddPet} className={styles.addForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Imię *</label>
                  <input
                    className={styles.formInput}
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="np. Pimpek"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rasa</label>
                  <input
                    className={styles.formInput}
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="np. Mieszaniec"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Wiek (miesiące) *</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    min={0}
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="np. 24"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Płeć</label>
                  <select
                    className={styles.formInput}
                    value={newPet.gender}
                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                  >
                    <option value="male">Samiec</option>
                    <option value="female">Samica</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rozmiar</label>
                  <select
                    className={styles.formInput}
                    value={newPet.size}
                    onChange={(e) => setNewPet({ ...newPet, size: e.target.value })}
                  >
                    <option value="small">Mały</option>
                    <option value="medium">Średni</option>
                    <option value="large">Duży</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Opis *</label>
                <textarea
                  className={styles.formTextarea}
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  placeholder="Opisz charakter i historię zwierzęcia..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Info zdrowotne</label>
                <input
                  className={styles.formInput}
                  value={newPet.healthInfo}
                  onChange={(e) => setNewPet({ ...newPet, healthInfo: e.target.value })}
                  placeholder="np. Zaszczepiony, wykastrowany"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tagi (oddziel przecinkami)</label>
                <input
                  className={styles.formInput}
                  value={newPet.tags}
                  onChange={(e) => setNewPet({ ...newPet, tags: e.target.value })}
                  placeholder="np. Przyjazny dzieciom, Aktywny"
                />
              </div>

              {addError && <p className={styles.errorMsg}>{addError}</p>}

              <div className={styles.modalButtons}>
                <button type="button" className={styles.przyciskAnuluj} onClick={() => setShowAddModal(false)}>
                  Anuluj
                </button>
                <button type="submit" className={styles.przyciskUsun} disabled={addLoading}>
                  {addLoading ? "Dodawanie..." : "Dodaj zwierzę"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: szczegóły wniosku ── */}
      {selectedApp && (
        <div className={styles.overlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setSelectedApp(null)}>✕</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalTytul}>Wniosek adopcyjny</div>
              <b className={
                selectedApp.status === "approved" ? styles.statusAvailable :
                selectedApp.status === "rejected" ? styles.statusAdopted :
                selectedApp.status === "reviewing" ? styles.statusReserved :
                styles.statusPending
              }>
                {statusAppLabel[selectedApp.status]}
              </b>
            </div>

            <div className={styles.detailGrid}>
              <div>
                <div className={styles.detailLabel}>WNIOSKODAWCA</div>
                <div className={styles.detailValue}>{selectedApp.applicantName}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>E-MAIL</div>
                <div className={styles.detailValue}>{selectedApp.applicantEmail}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>TELEFON</div>
                <div className={styles.detailValue}>{selectedApp.applicantPhone}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>DOTYCZY ZWIERZĘCIA</div>
                <div className={styles.detailValue}>{selectedApp.petName || selectedApp.petId}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>DATA ZŁOŻENIA</div>
                <div className={styles.detailValue}>{selectedApp.createdAt}</div>
              </div>
            </div>

            {selectedApp.message && (
              <div className={styles.messageBox}>
                <div className={styles.detailLabel}>WIADOMOŚĆ OD KANDYDATA:</div>
                <div className={styles.messageText}>{selectedApp.message}</div>
              </div>
            )}

            <div className={styles.divider} style={{ margin: "20px 0" }}>
              <Image src={line} className={styles.dividerChild} alt="" />
            </div>

            <div className={styles.detailLabel} style={{ marginBottom: 10 }}>ZMIEŃ STATUS WNIOSKU:</div>
            <div className={styles.statusButtons}>
              {(["pending", "reviewing", "approved", "rejected"] as ApplicationStatus[]).map((s) => (
                <button
                  key={s}
                  className={selectedApp.status === s ? styles.statusBtnActive : styles.statusBtn}
                  onClick={() => handleChangeAppStatus(selectedApp._id, s)}
                >
                  {statusAppLabel[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}