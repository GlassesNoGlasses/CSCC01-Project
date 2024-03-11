import { Link, useParams } from "react-router-dom";
import { GrantPageProps } from "./GrantPageProps";
import mockGrants from "../grant-browse/mockGrants";
import { Grant } from "../interfaces/Grant";

const GrantPage = ({}: GrantPageProps) => {
    const { grantId } = useParams();

    const grant: Grant | undefined = getGrant(grantId);

    return grant === undefined ? <GrantNotFound /> : <GrantFound grant={grant} />;
};

const GrantFound = ({ grant }: { grant: Grant }) => {
    return (
        <div className="flex flex-col gap-3 p-1 px-3">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-4xl font-bold">{grant.title}</h1>
                <ApplyButton grantId={grant.id.toString()} />
            </div>
            <h1 className="text-3xl">{`CAD $${grant.minAmount} - $${grant.maxAmount}`}</h1>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl">{grant.organization}</h2>
                <h2 className="text-2xl">{`Contact: ${grant.contact}`}</h2>
            </div>
            <h3 className="text-lg">{grant.category}</h3>
            <div className="flex flex-col">
                <h3 className="text-base">{`Posted: ${grant.posted.toDateString()}`}</h3>
                <h3 className="text-base">{`Deadline: ${grant.deadline.toDateString()}`}</h3>
            </div>

            <p className="text-base">{grant.description}</p>
        </div>
    );
}

const GrantNotFound = () => {
    return (
        <div className="flex flex-col gap-3 p-1 px-3">
            <h1 className="text-4xl font-bold">Grant Not Found</h1>
            <p className="text-base">The grant you are looking for does not exist.</p>
        </div>
    );
}

const ApplyButton = ({ grantId }: { grantId: String }) => {
    return (
        <Link className='p-2 px-5 m-2 bg-green-500 hover:bg-green-600 active:bg-green-700
          text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
          text-lg'
          to={`/grants/${grantId}/apply`}>
          Apply Now
        </Link>
      )
}


const getGrant = (grantId: String | undefined) => {
    if (grantId === undefined || Number.isNaN(Number(grantId)))
        return undefined;

    return mockGrants.find(grant => grant.id === Number(grantId));
}

export default GrantPage;