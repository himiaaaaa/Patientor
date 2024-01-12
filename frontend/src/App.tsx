import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Container } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";
import { Button } from "./@/components/ui/button";
import { Separator } from "./@/components/ui/separator"


import patientService from "./services/patients";
import diagnoseService from "./services/diagnosis";
import PatientListPage from "./components/PatientListPage";
import OnePatientPage from "./components/OnePatientPage";

import DiagnosesContext  from "./contexts/diagnosesContext";


const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();

    const fetchDiagnoseList = async () => {
      const allDiagnoses = await diagnoseService.getAll();
      setDiagnoses(allDiagnoses);
    };
    void fetchDiagnoseList();

  }, [patients, diagnoses]);

   const match = useMatch('/patients/:id')

   const patient = match
    ? patients.find(p => p.id === match.params.id)
    : null

  return (
    <div className="App">
        <Container>
          <h1 className="mt-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Patientor
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Simplify patient record management for seamless care coordination and informed medical decisions
          </p>
          <Button variant="outline" className="mt-5 mb-5 rounded" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Separator className="my-3"/>
          <DiagnosesContext.Provider value={diagnoses}>
            <Routes>
              <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
              <Route path="/patients/:id" element={<OnePatientPage patient={patient} diagnoses={diagnoses} />} />
            </Routes>
          </DiagnosesContext.Provider>
        </Container>
    </div>
  );
};

export default App;
