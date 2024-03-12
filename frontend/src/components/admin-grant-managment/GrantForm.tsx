import React from 'react'
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Grant, GrantQuestion } from '../interfaces/Grant' 

interface GrantFormProps {
    type: string,
    port: number
}

const GrantForm: React.FC<GrantFormProps> = ({ type, port }) => {
    const {user} = useUserContext();
    
    let { grantId } = useParams()
    const grantID = !grantId ? '' : grantId

    let initialGrantState: Grant = {
        id: Date.now(),
        title: '',
        description: '',
        posted: new Date(),
        deadline: new Date(),
        minAmount: 0,
        maxAmount: 100000,
        organization: '',
        category: '',
        contact: '',
        questions: [],
        publish: false,
        owner: user ? user.accountID : null
    };

    const [grant, setGrant] = useState<Grant>(initialGrantState);

    const getSavedGrant = async(id: string) => {
        try {
            const response = await fetch(`http://localhost:${port}/getGrant/${id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            await response.json().then((data) => {
                const { title, description, deadline, minAmount, maxAmount,
                    organization, category, contact, questions, publish, owner } = data['response']
                
                setGrant( { 
                    id: Date.now(),
                    title: title,
                    posted: new Date(),
                    description: description,
                    deadline: deadline,
                    minAmount: minAmount,
                    maxAmount: maxAmount,
                    organization: organization,
                    category: category,
                    contact: contact,
                    questions: questions,
                    publish: publish,
                    owner: owner
                    } )
                
            })
        } catch (error) {
        console.error('error creating grant:', (error as Error).message);
            setFeedback(`error creating grant`)
        }
    }

    useEffect(() => {
       
        if (type != 'create') {
            getSavedGrant(grantID)
        }
        
        return () => {
          
        };
      }, []);

    
    
    const [question, setQuestion] = useState<string>('');
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>Access Denied: Invalid Permission</div>
        )
    }

    if (grant.owner != user.accountID) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>
                Unauthorized: Permission Denied
            </div>)
    }

    if (grant.publish) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>
                Bad Request: Grant Cannot Be Editted Once Published
            </div>)
    }

    const deleteGrant = async(id: string) => {
        try {
            const response = await fetch(`http://localhost:${port}/deleteGrant/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'accId': user.accountID})
            });

            navigate('/')
            
        } catch (error) {
        console.error('error deleting grant:', (error as Error).message);
            setFeedback(`error deleting grant`)
        }
    }
    

    const handleQuestionSubmit = () => {
        if (question == '') return;

        let max = -1

        grant.questions.forEach((q) => {
            max = q['id'] > max ? q['id'] : max
        })

        const addQuestion = (prev: GrantQuestion[], newQuesion: string): GrantQuestion[] => {
            return [...prev, {id: max+1, question: newQuesion, answer: null}]
        }

        setGrant({ ...grant, questions: addQuestion(grant.questions, question)});
        setQuestion('')
    };

    const saveGrant = async(publish: boolean) => {
        let GRANTID = 0

        if (type == 'create'){
            try {
                const response = await fetch(`http://localhost:${port}/createGrant`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'accId': user.accountID, 'title': grant.title, 'description': grant.description, 'deadline': grant.deadline, 
                    'minAmount': grant.minAmount, "maxAmount": grant.maxAmount, 'organization': grant.organization,
                    'category': grant.category, "contact": grant.contact, 'questions': grant.questions, 'publish': publish }),
                });
        
            
                console.log('Successfully saved grant');
    
                await response.json().then((data) => {
                    GRANTID = data['id']
                });
            
        
            } catch (error) {
                console.error('error creating grant:', (error as Error).message);
                setFeedback(`error creating grant`)
            }
        } else {
            try {
                const response = await fetch(`http://localhost:${port}/editGrant/${grantID}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'accId': user.accountID, 'title': grant.title, 'description': grant.description, 'deadline': grant.deadline, 
                    'minAmount': grant.minAmount, "maxAmount": grant.maxAmount, 'organization': grant.organization,
                    'category': grant.category, "contact": grant.contact, 'questions': grant.questions, 'publish': publish }),
                });
        
            
                console.log('Successfully edited grant');
    
                await response.json().then((data) => {
                    GRANTID = data['id']
                });
            
        
            } catch (error) {
                console.error('error creating grant:', (error as Error).message);
                setFeedback(`error creating grant`)
            }
        }
        
        
        try {
        
            const response = await fetch(`http://localhost:${port}/addGrantToAdminList`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'accId': user.accountID, 'grantId': GRANTID, 'title': grant.title, 'description': grant.description, 'deadline': grant.deadline, 
                    'minAmount': grant.minAmount, "maxAmount": grant.maxAmount, 'organization': grant.organization,
                    'category': grant.category, "contact": grant.contact, 'questions': grant.questions, "publish": publish }),
            });
            
            if (publish){
                setFeedback(`Grant Published!`);
            } else {
                setFeedback(`Grant Saved!`);
            }
            
            if (type == 'create') setGrant(initialGrantState)
        } catch (error) {
            console.error('error creating grant:', (error as Error).message);
            setFeedback(`error creating grant`)
        }
    }

    const handleQChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuestion(value)
    };

    const handleRemoveQuestion = (id: number) => {
        setGrant({ ...grant, questions: grant.questions.filter(q => q.id != id)})
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGrant({ ...grant, [name]: value });
        setFeedback('')
    };

    const handleAmountChange = (name: 'minAmount' | 'maxAmount', value: number) => {
        setGrant({ ...grant, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveGrant(true)
        console.log('submitted')
    };

    const formatDateToYYYYMMDD = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-grantor-green">
            <div className="w-full max-w-2xl px-8 py-10 bg-white shadow-lg rounded-xl mt-10 mb-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{type === 'create' ? 'Create a Grant': 'Edit Grant'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization */}
                    <div>
                        <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">Organization</label>
                        <input type="text" name="organization" id="organization" value={grant.organization} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                        <input type="text" name="category" id="category" value={grant.category} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                        <input type="text" name="title" id="title" value={grant.title} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea name="description" id="description" value={grant.description} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={4}></textarea>
                    </div>
                    
                    {/* Deadline */}
                    <div>
                        <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">Deadline</label>
                        <input type="date" name="deadline" id="deadline" value={formatDateToYYYYMMDD(grant.deadline)}
                            onChange={(e) => setGrant({ ...grant, deadline: new Date(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact</label>
                        <input type="text" name="contact" id="contact" value={grant.contact} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Min Amount */}
                    <div>
                        <label htmlFor="minAmount" className="block text-gray-700 font-medium mb-2">Min Amount (USD)</label>
                        <input type="number" name="minAmount" id="minAmount" min="0" value={grant.minAmount.toString()}
                            onChange={(e) => handleAmountChange('minAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Max Amount */}
                    <div>
                        <label htmlFor="maxAmount" className="block text-gray-700 font-medium mb-2">Max Amount (USD)</label>
                        <input type="number" name="maxAmount" id="maxAmount" min={grant.minAmount.toString()} value={grant.maxAmount.toString()}
                            onChange={(e) => handleAmountChange('maxAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>

                    <div className='mt-6'>
                        <label htmlFor="question" className="block text-gray-700 font-medium mb-2">Add a Question for Applicants</label>

                        <div className='flex items-center'>
                            <input type="text" name="question" value={question} onChange={handleQChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mr-4" />
                            <button type='button' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800' onClick={handleQuestionSubmit}>add</button>
                        </div>
                    </div>

                    {grant.questions && grant.questions.length > 0 && (
                        <div className='mt-6'>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Questions</h3>
                            {grant.questions.map((question) => (
                                <div key={question.id} className="mb-4 flex justify-between p-2 border-gray-300 border items-center rounded-lg">
                                    <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-medium max-w-[80%]">
                                        {question.question}
                                    </label>
                                    <button type='button'className='text-[1rem] p-2 bg-red-500 text-white pl-5 pr-5 rounded-lg hover:bg-red-600' 
                                        onClick={() =>{ handleRemoveQuestion(question.id)} }>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='h-[40px] flex justify-center items-center'>{feedback}</div>

        
                    <div className={`flex ${type === 'create' ? 'justify-end' : 'justify-between'} gap-8 `}>
                        {type === 'create' ? <></> : <button type='button' className='p-2 bg-red-600 text-white pl-5 pr-5 rounded-lg hover:bg-red-800' onClick={() => deleteGrant(grantID)}>Delete</button>}
                        <div className='flex justify-end'>
                            <button type='button' className='p-2 bg-blue-600 text-white pl-5 pr-5 rounded-lg hover:bg-blue-800 mr-10' onClick={() => saveGrant(false)}>Save</button>
                            <button type='submit' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800'>Publish</button>
                        </div>
                    </div>
                   
                </form>
                {/* <button type='button' onClick={() => getSavedGrant('65ef27538cf8496fab274208')}>fetch</button> */}
            </div>
        </div>
    );
}

export default GrantForm