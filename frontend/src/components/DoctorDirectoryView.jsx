import React, { useState } from 'react';
import { Search, MapPin, Award, Star, Calendar, Phone, CheckCircle, Sparkles } from 'lucide-react';

const DOCTORS_DATABASE = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Kulkarni',
    initial: 'R',
    qualification: 'MBBS, MD (Internal Medicine)',
    specialty: 'General Physician',
    experience: '16 Years Exp',
    rating: 4.9,
    reviews: 142,
    hospital: 'Apollo Clinic, Panaji',
    availability: 'Available Today',
    fee: '₹500'
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sharma',
    initial: 'A',
    qualification: 'MBBS, DNB, DM (Cardiology)',
    specialty: 'Cardiologist',
    experience: '12 Years Exp',
    rating: 4.95,
    reviews: 210,
    hospital: 'Manipal Hospital, Margao',
    availability: 'Next Slot: Tomorrow 10:30 AM',
    fee: '₹800'
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikram Naik',
    initial: 'V',
    qualification: 'MBBS, MS (ENT)',
    specialty: 'ENT & Sinus Specialist',
    experience: '14 Years Exp',
    rating: 4.8,
    reviews: 98,
    hospital: 'Goa Medical Trust, Mapusa',
    availability: 'Available Today',
    fee: '₹600'
  },
  {
    id: 'doc-4',
    name: 'Dr. Meera Iyer',
    initial: 'M',
    qualification: 'MBBS, MD (Pediatrics)',
    specialty: 'Pediatrician',
    experience: '9 Years Exp',
    rating: 4.9,
    reviews: 165,
    hospital: 'Mother & Child Care, Porvorim',
    availability: 'Available Today',
    fee: '₹550'
  },
  {
    id: 'doc-5',
    name: 'Dr. Amit Tendulkar',
    initial: 'A',
    qualification: 'MBBS, MS (Orthopedics)',
    specialty: 'Orthopedic Surgeon',
    experience: '18 Years Exp',
    rating: 4.85,
    reviews: 184,
    hospital: 'Sunshine Ortho Clinic, Vasco',
    availability: 'Next Slot: Friday',
    fee: '₹700'
  },
  {
    id: 'doc-6',
    name: 'Dr. Sunita Deshmukh',
    initial: 'S',
    qualification: 'MBBS, MD (Endocrinology)',
    specialty: 'Diabetes & Thyroid',
    experience: '11 Years Exp',
    rating: 4.92,
    reviews: 120,
    hospital: 'City Diabetes Center, Panaji',
    availability: 'Available Today',
    fee: '₹650'
  }
];

export default function DoctorDirectoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookedDoctorId, setBookedDoctorId] = useState(null);

  const specialties = ['All', 'General Physician', 'Cardiologist', 'ENT & Sinus Specialist', 'Pediatrician', 'Orthopedic Surgeon', 'Diabetes & Thyroid'];

  const filteredDoctors = DOCTORS_DATABASE.filter(doc => {
    const matchesQuery = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  const handleBook = (id) => {
    setBookedDoctorId(id);
    setTimeout(() => setBookedDoctorId(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Search Bar strictly matching wireframe Right Screen */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight">
              Search for Doctor
            </h1>
            <p className="text-xs text-slate-400">
              Connect with certified doctors, view qualifications, and schedule consultations.
            </p>
          </div>

          {/* Search Input matching wireframe [Search] bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor, qualification, hospital..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400 shadow-inner"
            />
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all border ${
                selectedSpecialty === spec
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-xs'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid matching wireframe 3-column / 2-row layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const isBooked = bookedDoctorId === doc.id;

          return (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3.5">
                
                {/* Doctor Header: Circular Avatar + Details matching wireframe */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-500 to-emerald-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {doc.initial}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {doc.name}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {doc.qualification}
                    </p>

                    {/* Specialty in cyan highlighted box strictly matching wireframe's blue/cyan rectangle around "specialty"! */}
                    <div className="pt-0.5">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-400 px-2.5 py-0.5 rounded-md shadow-xs">
                        {doc.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {doc.hospital}
                    </span>
                    <span className="font-bold text-white">{doc.fee}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-900">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" /> {doc.rating} ({doc.reviews})
                    </span>
                    <span className="text-emerald-400 font-medium">{doc.experience}</span>
                  </div>
                </div>

              </div>

              {/* Consultation Action */}
              <button
                onClick={() => handleBook(doc.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  isBooked
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 text-white border-slate-700'
                }`}
              >
                {isBooked ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Consultation Requested!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Follow-up ({doc.availability})</span>
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
