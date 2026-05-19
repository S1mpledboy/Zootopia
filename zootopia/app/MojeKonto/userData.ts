export interface UserData {
  imie: string;
  nazwisko: string;
  kraj: string;
  ulica: string;
  miasto: string;
  kodPocztowy: string;
  telefon: string;
  email: string;
  haslo: string;
}

export let userData: UserData = {
  imie: "Jan",
  nazwisko: "Kowalski",
  kraj: "Polska",
  ulica: "Kwiatowa 12",
  miasto: "Warszawa",
  kodPocztowy: "00-001",
  telefon: "123456789",
  email: "jan@test.pl",
  haslo: "admin123",
};

export const updateUserData = (newData: Partial<UserData>) => {
  userData = {
    ...userData,
    ...newData,
  };
};