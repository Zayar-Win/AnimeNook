import Button from '@/Components/Button';
import DeleteModal from '@/Components/DeleteModal';
import Table from '@/Components/Table';
import TableData from '@/Components/TableData';
import AdminLayout from '@/Layouts/AdminLayout'
import { Link, router } from '@inertiajs/react';
import moment from 'moment';
import React, { useState } from 'react'

const columns = [
    {
        field: "Name",
    },
    {
        field: "SubDomain",
        minWidth: "50px",
    },
    {
        field: "Logo",
    },
    {
        field: "Plan",
    },
    {
        field: "Start Date",
    },
    {
        field: "Expire Date",
    },
    {
        field: "Action",
    },
];

const Index = ({groups}) => {
    const [isDeleteModalOpen,setIsDeleteModalOpen]  =  useState(false);
    const [selectedGroup,setSelectedGroup]  = useState(null);
    const deleteHandler = () => {
        router.post(
            window.route("admin.groups.delete", { group: selectedGroup }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
            }
        );
    };
    return (
        <div>
            <h1 className="text-center text-xl font-bold my-10">
                Group Management
            </h1>
            <div className="flex justify-end">
                <Button
                    text={'Create Group'}
                    type={'link'}
                    href={window.route('admin.groups.create')}
                    className={"!bg-blue-500 my-8 mr-5"}
                />
            </div>
            <Table datas={groups} columns={columns}>
                <TableData>{(group) => <p className='text-lg font-bold'>{group.name}</p>}</TableData>
                <TableData>{(group) => <Link className='underline text-primary' href={window.route('group.home',{group})}>{group.subdomain}</Link>}</TableData>
                <TableData>
                    {(group) => (
                        <img
                            className="w-10 h-10 object-cover rounded-full"
                            src={group.logo}
                            alt="Jese image"
                        ></img>
                    )}
                </TableData>
                <TableData>{(group) => <p className='capitalize font-bold '>{group.plan.name}</p>}</TableData>
                <TableData>
                    {(group) => <p className="capitalize">{moment(group.start_date).format("MMM DD, YYYY hh:mm")}</p>}
                </TableData>
                <TableData>
                    {(group) => <p className="capitalize">{moment(group.expire_date).format('MMM DD, YYYY hh:mm')}</p>}
                </TableData>
                <TableData>
                    {(group) => (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Link
                                href={window.route("admin.groups.edit", {
                                    group,
                                })}
                                className="hover:underline"
                            >
                                Edit
                            </Link>
                            <div
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedGroup(group);
                                }}
                                className="hover:underline cursor-pointer"
                            >
                                Delete
                            </div>
                        </div>
                    )}
                </TableData>
            </Table>
            {isDeleteModalOpen && (
                <DeleteModal
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    deleteHandler={deleteHandler}
                    title={"Are you sure want to delete this group."}
                />
            )}
        </div>
    )
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Index