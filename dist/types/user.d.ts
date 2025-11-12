export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}
export interface Demografi {
    usia: number;
    kota: "Jakarta" | "Surabaya" | "Bandung" | "Medan" | "Lainnya";
    status: "Menikah" | "Lajang";
}
export interface Nasabah {
    id: number;
    nama: string;
    skorProbabilitas: number;
    statusBerlangganan: "Ya" | "Tidak";
    demografi: Demografi;
    informasiRelevan: string;
}
export type JobType = "admin." | "blue-collar" | "entrepreneur" | "housemaid" | "management" | "retired" | "self-employed" | "services" | "student" | "technician" | "unemployed" | "unknown";
export type MaritalStatus = "divorced" | "married" | "single" | "unknown";
export type EducationLevel = "basic.4y" | "basic.6y" | "basic.9y" | "high.school" | "illiterate" | "professional.course" | "university.degree" | "unknown";
export type ContactType = "cellular" | "telephone" | "unknown";
export type Month = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";
export type POutcome = "failure" | "nonexistent" | "success" | "other";
export type Binary = "yes" | "no";
export interface NasabahMarketing {
    name?: string;
    id: string;
    userId: string;
    age: number;
    job: string;
    marital: string;
    education: string;
    default: boolean;
    balance?: number;
    housing: boolean;
    loan: boolean;
    contact: string;
    last_contact_day: string;
    last_contact_month: string;
    duration: number;
    campaign_contacts: number;
    pdays: number;
    previous_contacts: number;
    poutcome: POutcome;
    subscribed_term_deposit: Binary;
}
