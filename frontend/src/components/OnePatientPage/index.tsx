import {  useState } from "react";
import { Patient, Gender, Diagnosis, Entry, HealthCheckRating, EntryWithoutId } from "../../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import { Button } from "src/@/components/ui/button";
import patientService from "../../services/patients";
import axios from "axios";
import AddEntryModel from "../AddEntryModel";
import {
    Card,
    CardHeader,
    Avatar,
    CardBody,
    CardFooter
  } from "@material-tailwind/react";

interface Props {
    patient : Patient | null | undefined
    diagnoses: Diagnosis[]
}

const genderId = (gender: Gender | undefined ) => {
    switch(gender){
        case "female":
            return <FemaleIcon />;
        case "male":
            return <MaleIcon/>;
        default:
            return null;
    }
}

const HealthRating = (health: HealthCheckRating) => {
    switch(health){
        case 0:
            return <FavoriteIcon sx={{ color: "green" }}/>;
        case 1:
            return <FavoriteIcon sx={{ color: "yellow" }}/>;
        case 2:
            return <FavoriteIcon sx={{ color: "blue" }}/>;
        case 3:
            return <FavoriteIcon sx={{ color: "red" }}/>;
    }
}

const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

const EntryDetails = ({ entry }: { entry: Entry } ) => {
    switch(entry.type){
        case "HealthCheck": 
            return (
                <div className="font-thin mt-4">
                    <strong>Health Rating: </strong> {HealthRating(entry.healthCheckRating)}
                </div>
            );
        case "Hospital":
            return (
                <div className="font-thin">
                    <p className="mt-4"><strong>Discharge date: </strong>{entry.discharge.date}</p>
                    <ul>
                       <li className="mt-4"><strong>Criteria: </strong><i>{entry.discharge.criteria}</i></li> 
                    </ul>
                    
                </div>
            );
        case "OccupationalHealthcare":
            return (
                <div className="mt-4 font-thin">
                    {entry.sickLeave? 
                      <p><strong>Sick Leave: </strong>{entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p>
                       : null
                    }
                </div>
            );
        default:
            return assertNever(entry);
    }
}

const OnePatientPage = ({ patient, diagnoses }: Props) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    
    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
      };
  
    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            if(patient){
                const entry = await patientService.addEntry(patient.id, values);
                patient = {...patient, entries: patient.entries.concat(entry)};
                setModalOpen(false);
            }
        } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    };

   return(
    <div>
       {/* {patient profile card} */}
       <Card className="w-full items-center mb-10 text-black">
            <CardHeader
              floated={false}
              shadow={false}
              className="mx-0 flex items-center gap-4 py-8 pl-5"
            >
              <Avatar
                size="xl"
                variant="circular"
                src={`https://eu.ui-avatars.com/api/?name=${patient?.name[0]}+${patient?.name.split(' ')[1]?.[0]}&size=250`}
                className="rounded-sm"
              />
              <div className="flex w-full flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="flex justify-center scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                    {patient?.name} {genderId(patient?.gender)}
                  </h3>
                </div>
                <p ><strong>ssn: </strong>{patient?.ssn}</p>
                <p ><strong>occupation: </strong>{patient?.occupation}</p>
              </div>
            </CardHeader>
        </Card>
        
        {/* add entry */}
        <AddEntryModel
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
            modalOpen={modalOpen}
        />

        {/* entry list */}
        <h3 className="flex justify-center scroll-m-20 text-2xl font-semibold tracking-tight mb-5 mt-10">
          Entries
        </h3>
       {patient?.entries.map(e => {
            return (
                <div key={e.id}>
                  <Card className="pt-5 py-5 px-5 text-black mb-8">
                  <CardHeader className="text-center text-black shadow-none font-thin">
                    <p>{e.date}</p>
                  </CardHeader>
                  <CardBody>
                    {e.type === "OccupationalHealthcare" ?
                        e.employerName ? 
                            <p className="mb-5">
                                 <WorkIcon /> {e.employerName} 
                            </p> 
                            : <WorkIcon className="mb-5"/> 
                        : <MedicalServicesIcon className="mb-5"/>
                    }
                    <p className="underline font-thin">{e.description}</p>
                    <ul className="font-thin mt-4">
                        {e.diagnosisCodes?.map(d => {
                            const diagnosis = diagnoses.find(diagnose => diagnose.code === d)?.name
                            return ( 
                            <li key={d}>
                                <strong>{d}</strong> {`-->`} {diagnosis? diagnosis : null}
                            </li> 
                            )
                          }
                        )}
                     </ul>
                     <EntryDetails entry={e}/>
                     </CardBody>
                     <CardFooter className="mb-0 font-thin">
                     <p>Diagnose by {e.specialist}</p>
                     </CardFooter>
                  </Card> 
                 
                </div>)
            }
        )}
        <Button className="bg-black hover:bg-black text-white rounded mt-5" onClick={() => openModal()}>
            Add New Entry
        </Button>
    </div>
   )
}

export default OnePatientPage;