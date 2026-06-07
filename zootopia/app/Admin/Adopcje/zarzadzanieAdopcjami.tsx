"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./adopcje.module.css";

import line from "@/app/Public/Images/line.svg";
import lupa from "@/app/Public/Images/lupa.svg";
import kosz from "@/app/Public/Images/kosz.svg";

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

const emptyPetForm = {
  name: "",
  breed: "",
  age: "",
  gender: "male" as "male" | "female",
  size: "medium" as "small" | "medium" | "large",
  description: "",
  healthInfo: "",
  tags: "",
};

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

// ── Formularz wyciągnięty na zewnątrz, aby uniknąć utraty fokusu ──────────────────
interface PetFormProps {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  form: typeof emptyPetForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyPetForm>>;
  formError: string;
  formLoading: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

function PetForm({
  onSubmit,
  submitLabel,
  form,
  setForm,
  formError,
  formLoading,
  imagePreview,
  fileInputRef,
  handleImageChange,
  onCancel
}: PetFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.addForm}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Imię *</label>
          <input className={styles.formInput} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="np. Pimpek" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Rasa</label>
          <input className={styles.formInput} value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder="np. Mieszaniec" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Wiek (miesiące) *</label>
          <input className={styles.formInput} type="number" min={0} value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="np. 24" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Płeć</label>
          <select className={styles.formInput} value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as "male" | "female" })}>
            <option value="male">Samiec</option>
            <option value="female">Samica</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Rozmiar</label>
          <select className={styles.formInput} value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value as "small" | "medium" | "large" })}>
            <option value="small">Mały</option>
            <option value="medium">Średni</option>
            <option value="large">Duży</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Opis *</label>
        <textarea className={styles.formTextarea} rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Opisz charakter i historię zwierzęcia..." />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Info zdrowotne</label>
        <input className={styles.formInput} value={form.healthInfo}
          onChange={(e) => setForm({ ...form, healthInfo: e.target.value })}
          placeholder="np. Zaszczepiony, wykastrowany" />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Tagi (oddziel przecinkami)</label>
        <input className={styles.formInput} value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="np. Przyjazny dzieciom, Aktywny" />
      </div>

      {/* Upload zdjęcia */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Zdjęcie</label>
        <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
          {imagePreview ? (
            <div className={styles.previewWrapper}>
              <img src={imagePreview} alt="Podgląd" className={styles.previewImg} />
              <span className={styles.previewChange}>Kliknij, aby zmienić</span>
            </div>
          ) : (
            <div className={styles.uploadPlaceholder}>
              <span className={styles.uploadIcon}>📷</span>
              <span className={styles.uploadText}>Kliknij, aby dodać zdjęcie</span>
              <span className={styles.uploadHint}>JPG, PNG, WEBP</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      {formError && <p className={styles.errorMsg}>{formError}</p>}

      <div className={styles.modalButtons}>
        <button type="button" className={styles.przyciskAnuluj} onClick={onCancel}>
          Anuluj
        </button>
        <button type="submit" className={styles.przyciskZapisz} disabled={formLoading}>
          {formLoading ? "Zapisywanie..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ── Główny Komponent ─────────────────────────────────────────────────────────────
export default function ZarzadzanieAdopcjami() {
  const [tab, setTab] = useState<AdoptionTab>("zwierzeta");
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [form, setForm] = useState(emptyPetForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ── Upload zdjęcia ────────────────────────────────────────────────────────

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Błąd uploadu zdjęcia");
    const data = await res.json();
    return data.url;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function openAddModal() {
    setForm(emptyPetForm);
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setShowAddModal(true);
  }

  function openEditModal(pet: Pet) {
    setForm({
      name: pet.name,
      breed: pet.breed || "",
      age: String(pet.age),
      gender: pet.gender,
      size: pet.size,
      description: pet.description,
      healthInfo: pet.healthInfo || "",
      tags: pet.tags.join(", "),
    });
    setImageFile(null);
    setImagePreview(pet.images?.[0] || "");
    setFormError("");
    setEditPet(pet);
  }

  // ── Dodaj zwierzę ─────────────────────────────────────────────────────────

  async function handleAddPet(e: React.FormEvent) {
    e.preventDefault();
    formError && setFormError("");
    if (!form.name || !form.description || !form.age) {
      setFormError("Wypełnij wymagane pola: imię, wiek, opis.");
      return;
    }
    setFormLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const url = await uploadImage();
        if (url) imageUrl = url;
      }
      const res = await fetch("/api/admin/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          images: imageUrl ? [imageUrl] : [],
          isActive: true,
          status: "available",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPets((prev) => [data.pet, ...prev]);
      setShowAddModal(false);
    } catch {
      setFormError("Nie udało się dodać zwierzęcia.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Edytuj zwierzę ────────────────────────────────────────────────────────

  async function handleEditPet(e: React.FormEvent) {
    e.preventDefault();
    if (!editPet) return;
    setFormError("");
    if (!form.name || !form.description || !form.age) {
      setFormError("Wypełnij wymagane pola: imię, wiek, opis.");
      return;
    }
    setFormLoading(true);
    try {
      let images = editPet.images || [];
      if (imageFile) {
        const url = await uploadImage();
        if (url) images = [url];
      }
      const body = {
        name: form.name,
        breed: form.breed,
        age: Number(form.age),
        gender: form.gender,
        size: form.size,
        description: form.description,
        healthInfo: form.healthInfo,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        images,
      };
      await fetch(`/api/admin/pets/${editPet._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setPets((prev) =>
        prev.map((p) => (p._id === editPet._id ? { ...p, ...body } : p))
      );
      setEditPet(null);
    } catch {
      setFormError("Nie udało się zapisać zmian.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Usuń zwierzę ──────────────────────────────────────────────────────────

  async function handleDeletePet() {
    if (!petToDelete) return;
    try {
      await fetch(`/api/admin/pets/${petToDelete._id}`, { method: "DELETE" });
      setPets((prev) => prev.filter((p) => p._id !== petToDelete._id));
      setPetToDelete(null);
    } catch {
      alert("Błąd podczas usuwania.");
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

  // ── Wnioski ───────────────────────────────────────────────────────────────

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
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : prev));
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

        {/* Tytuł */}
        <div className={styles.tytulRow}>
          <div className={styles.pageTitle}>Zarządzanie adopcjami</div>
          <div className={styles.tytulActions}>
            {tab === "zwierzeta" && (
              <button className={styles.btnDodaj} onClick={openAddModal}>
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

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} alt="" />
        </div>

        {/* Zakładki */}
        <div className={styles.tabRow}>
          <div
            className={tab === "zwierzeta" ? styles.tabItemActive : styles.tabItem}
            onClick={() => { setTab("zwierzeta"); setSearch(""); }}
          >
            <b>Zwierzęta</b>
            <b>({pets.length})</b>
          </div>
          <div
            className={tab === "wnioski" ? styles.tabItemActive : styles.tabItem}
            onClick={() => { setTab("wnioski"); setSearch(""); }}
          >
            <b>Wnioski adopcyjne</b>
            <b>({applications.length})</b>
          </div>
        </div>

        <div className={styles.divider}>
          <Image src={line} className={styles.dividerChild} alt="" />
        </div>

        {/* Lista zwierząt */}
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
                      {pet.breed || "Mieszaniec"} · {formatAge(pet.age)} · {pet.gender === "male" ? "Samiec" : "Samica"}
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
                    <span className={styles.editBtn} onClick={() => openEditModal(pet)}>
                      EDYTUJ
                    </span>
                    <Image src={kosz} width={16} height={18} alt="Usuń"
                      style={{ cursor: "pointer" }} onClick={() => setPetToDelete(pet)} />
                  </div>
                </div>
                {i < filteredPets.length - 1 && (
                  <Image src={line} className={styles.dividerChild} alt="" />
                )}
              </div>
            ))}
          </>
        )}

        {/* Lista wniosków */}
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
                    <span className={styles.editBtn} onClick={() => setSelectedApp(app)}>
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

      {/* Modal: usuń */}
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

      {/* Modal: dodaj */}
      {showAddModal && (
        <div className={styles.overlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setShowAddModal(false)}>✕</button>
            <div className={styles.modalTytul}>Dodaj nowe zwierzę</div>
            <PetForm
              onSubmit={handleAddPet}
              submitLabel="Dodaj zwierzę"
              form={form}
              setForm={setForm}
              formError={formError}
              formLoading={formLoading}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: edytuj */}
      {editPet && (
        <div className={styles.overlay} onClick={() => setEditPet(null)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setEditPet(null)}>✕</button>
            <div className={styles.modalTytul}>Edytuj: {editPet.name}</div>
            <PetForm
              onSubmit={handleEditPet}
              submitLabel="Zapisz zmiany"
              form={form}
              setForm={setForm}
              formError={formError}
              formLoading={formLoading}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              onCancel={() => setEditPet(null)}
            />
          </div>
        </div>
      )}

      {/* Modal: szczegóły wniosku */}
      {selectedApp && (
        <div className={styles.overlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <button className={styles.przyciskX} onClick={() => setSelectedApp(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalTytul} style={{ margin: 0 }}>Wniosek adopcyjny</div>
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
              {[
                { label: "WNIOSKODAWCA", value: selectedApp.applicantName },
                { label: "E-MAIL", value: selectedApp.applicantEmail },
                { label: "TELEFON", value: selectedApp.applicantPhone },
                { label: "DOTYCZY ZWIERZĘCIA", value: selectedApp.petName || selectedApp.petId },
                { label: "DATA ZŁOŻENIA", value: selectedApp.createdAt },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className={styles.detailLabel}>{label}</div>
                  <div className={styles.detailValue}>{value}</div>
                </div>
              ))}
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

            <div className={styles.detailLabel} style={{ marginBottom: 10 }}>ZMIEŃ STATUS:</div>
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