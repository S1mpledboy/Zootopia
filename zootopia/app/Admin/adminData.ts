export interface AdminData {
  imie: string;
  nazwisko: string;
  telefon: string;
  email: string;
  haslo: string;
}

export let adminData: AdminData = {
  imie: "Jan",
  nazwisko: "Kowalski",
  telefon: "123456789",
  email: "jan@test.pl",
  haslo: "admin123",
};

export const updateAdminData = (newData: Partial<AdminData>) => {
  adminData = {
    ...adminData,
    ...newData,
  };
};