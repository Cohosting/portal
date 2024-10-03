import { CurrencyDollar, Desk, UserPlus, Users } from "@phosphor-icons/react";

const TeamOverview = ({ companyName, totalSeats, filledSeats, freeSeatsLimit, additionalSeatCost }) => {
    const freeSeats = Math.max(freeSeatsLimit - filledSeats, 0);
    const paidSeats = Math.max(filledSeats - freeSeatsLimit, 0);
    const availablePaidSeats = totalSeats - Math.max(filledSeats, freeSeatsLimit);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{companyName}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Team Seating Overview</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                        <div className="flex items-center justify-between sm:justify-start sm:w-1/2">
                            <div className="flex items-center">
                                <Desk className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">Total Seats</span>
                            </div>
                            <span className="text-sm text-gray-900 sm:ml-4">{totalSeats}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start sm:w-1/2 mt-4 sm:mt-0">
                            <div className="flex items-center">
                                <Users className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">Filled Seats</span>
                            </div>
                            <span className="text-sm text-gray-900 sm:ml-4">{filledSeats}</span>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <UserPlus className="mr-2 h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium text-gray-500">Free Seats</span>
                            </div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {freeSeats} Available (of {freeSeatsLimit} free seats)
                            </span>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CurrencyDollar className="mr-2 h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium text-gray-500">Paid Seats</span>
                            </div>
                            <div>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {paidSeats} In Use
                                </span>
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    {availablePaidSeats} Available
                                </span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
export default TeamOverview;