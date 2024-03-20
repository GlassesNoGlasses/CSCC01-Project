import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ApplicationsController from "../../../controllers/ApplicationsController";
import { Application } from "../../../interfaces/Application";
import UserController from "../../../controllers/UserController";
import { Applicant } from "../../../interfaces/Applicant";
import { Grant, GrantQuestion } from "../../../interfaces/Grant";
import GrantsController from "../../../controllers/GrantsController";

const ApplicationReview = () => {
    const { applicationID } = useParams();
    const [ application, setApplication ] = useState<Application | undefined>();
    const [ applicant, setApplicant ] = useState<Applicant | undefined>();
    const [ grant, setGrant ] = useState<Grant | undefined>();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const rejectApplication = () => {

    };

    const submitApplicationReview = () => {

    };

    const approveApplication = () => {

    };

    useEffect(() => {
        if (applicationID) {
            ApplicationsController.fetchApplication(applicationID).then((application: Application | undefined) => {
                if (application) {
                    setApplication(application);
                    return application;
                }
            });
        }
    }, [applicationID]);

    useEffect(() => {
        if (application) {
            UserController.fetchApplicant(application.applicantID).then((applicant: Applicant | undefined) => {
                if (applicant) {
                    setApplicant(applicant);
                }
            });

            GrantsController.fetchGrant(application.grantID).then((grant: Grant | undefined) => {
                if (grant) {
                    setGrant(grant);
                }
            });
        }

    }, [application]);

    return (
        <div id="review-container" className="flex flex-col shadow-[0_4px_25px_rgba(0,0,0,0.2)] rounded m-8 pb-8">
            <div id="review-header" className="flex flex-row justify-between items-center px-8">
                <span className="py-4 text-xl font-bold">Review Grant Application</span>
                <div id="star-rating" className="flex flex-row items-center gap-3">
                    <span className="text-lg">Rating</span>
                    <div id="stars:">
                        {[1,2,3,4,5].map((star) => (
                            <button 
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(rating)} // set hoverRating to rating when not hovering
                            >
                                <StarIcon className={`h-8 w-8 ${star <= hoverRating ? 'text-yellow-500' : 'text-gray-500'}`}/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between px-8 gap-4">
                <div id="application-info-container" className="flex flex-col w-3/4 gap-4">
                    <div id="applicant-info" className="flex flex-col border-2 rounded border-magnify-blue p-2">
                        <span className="text-lg">Applicant</span>
                        <div id="name" className="flex flex-row justify-between">
                            <span>Name:</span>
                            <span>{applicant ? applicant.firstName + ' ' + applicant.lastName : 'Applicant not found'}</span>
                        </div>
                        <div id="email" className="flex flex-row justify-between">
                            <span>Email:</span> 
                            <span>{applicant ? applicant.email : 'Applicant not found'}</span>
                        </div>
                    </div>
                    <ul id="application-fields" className="flex flex-col border-2 rounded border-magnify-blue p-2 gap-4">
                        {
                            application ? application.responses.map((grantQuestion: GrantQuestion, index: number) => (
                                <li key={index}>
                                    <div id={`question-${index}`} className="font-bold italic">Question: {grantQuestion.question}</div>
                                    <div id={`response-${index}`}>{grantQuestion.answer}</div>
                                </li>
                            ))

                            : <div>Application not found</div>
                        }
                    </ul>
                </div>
                <div id="right-col" className="flex flex-col w-1/2 gap-4">
                    <div id="grant-info-container" className="flex flex-col p-2 border-2 rounded border-magnify-blue">
                        <span className="text-lg">Grant Info</span>
                        <div id="grant-title" className="flex flex-row justify-between">
                            <span>Title:</span>
                            <span>{grant ? grant.title : "Grant not found"}</span>
                        </div>
                        <div id="grant-description" className="flex flex-row justify-between">
                            <span>Description:</span>
                            <span>{grant ? grant.description : "Grant not found."}</span>
                        </div>
                        <div id="grant-category" className="flex flex-row justify-between">
                            <span>Category:</span>
                            <span>{grant ? grant.category : "Grant not found."}</span>
                        </div>
                        <div id="grant-funding" className="flex flex-row justify-between">
                            <span>Funding Amount:</span>
                            <span>{grant ? grant.minAmount + " - " + grant.maxAmount : "Grant not found."}</span>
                        </div>
                        <div id="grant-deadline" className="flex flex-row justify-between">
                            <span>Deadline:</span>
                            <span>{grant ? grant.deadline.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'})
                                        : "Grant not found."}
                            </span>
                        </div>
                    </div>
                    <div id="notes" className="p-1 h-full">
                        <textarea
                            className='outline outline-2 outline-magnify-blue p-2 w-full h-full rounded'
                            placeholder="Application notes."
                            onChange={(e) => {}}
                        />
                    </div>
                    
                </div>
            </div>
            <div id="actions" className="flex flex-row justify-between px-8 pt-4">
                <button id="reject" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={rejectApplication}
                >
                    Reject
                </button>
                <button id="submit review" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={submitApplicationReview}
                >
                    Submit Review
                </button>
                <button id="approve" className="bg-magnify-blue py-5 px-10 rounded-xl text-white font-bold hover:bg-magnify-dark-blue transition ease-in-out duration-200"
                    onClick={approveApplication}
                >
                    Approve
                </button>
            </div>
        </div>
    );
};

export default ApplicationReview;