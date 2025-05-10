
// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { FiPlus, FiTrash2, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi';
// import { format, parseISO } from 'date-fns';
// import {
//   createTask,
//   deleteTask,
//   getTasksByUserId,
//   updateTaskStatus,
//   updateTask,
//   deleteCompletedTasks,
// } from 'services/apiCollection';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type TaskStatus = 'pending' | 'completed';

// interface Task {
//   id: string;
//   userId: string;
//   heading: string;
//   text: string;
//   endTime: Date | null;
//   createDate: Date;
//   status: TaskStatus;
// }

// interface NewTask {
//   heading: string;
//   text: string;
//   endTime: string;
// }

// interface ButtonLoading {
//   add: boolean;
//   edit: boolean;
//   delete: string;
//   toggle: string;
//   deleteAll: boolean;
// }

// const TaskManager = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState<NewTask>({
//     heading: '',
//     text: '',
//     endTime: '',
//   });
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [buttonLoading, setButtonLoading] = useState<ButtonLoading>({
//     add: false,
//     edit: false,
//     delete: '',
//     toggle: '',
//     deleteAll: false,
//   });

//   const formRef = useRef<HTMLDivElement>(null);
//   const userId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   useEffect(() => {
//     if (!userId) return;
//     const fetchTasks = async () => {
//       try {
//         const apiTasks = await getTasksByUserId(userId);
//         const formattedTasks = apiTasks.map((task: any) => ({
//           id: task.task_id.toString(),
//           userId: task.user_id,
//           heading: task.task_text,
//           text: '',
//           endTime: task.end_time ? parseISO(task.end_time) : null,
//           createDate: parseISO(task.create_date),
//           status: task.status as TaskStatus,
//         }));

//         const sortedTasks = formattedTasks.sort((a: Task, b: Task) => {
//           if (a.status === b.status) {
//             return b.createDate.getTime() - a.createDate.getTime();
//           }
//           return a.status === 'pending' ? -1 : 1;
//         });

//         setTasks(sortedTasks);
//       } catch (err) {
//         setError('Failed to load tasks');
//         toast.error('Failed to load tasks');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [userId]);

//   // useEffect(() => {
//   //   // Scroll to form when it appears
//   //   if (showAddForm && formRef.current) {
//   //     formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//   //   }
//   // }, [showAddForm]);

//   useEffect(() => {
//     if (showAddForm) {
//       // Prevent body scrolling
//       document.body.style.overflow = 'hidden';
      
//       // Scroll to form
//       if (formRef.current) {
//         setTimeout(() => {
//           formRef.current?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center',
//           });
//         }, 100);
//       }
//     } else {
//       // Restore body scrolling
//       document.body.style.overflow = 'auto';
//     }
  
//     // Cleanup function to restore scrolling when component unmounts
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [showAddForm, editingTask]);

//   const handleAddTask = async () => {
//     if (!newTask.heading.trim() || !newTask.endTime.trim()) {
//       setError('Task Description* and Due Date is required');
//       toast.error('Task Description* and Due Date is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, add: true });
//       const taskData = {
//         user_id: userId,
//         task_text: newTask.heading,
//         end_time: newTask.endTime
//           ? new Date(newTask.endTime).toISOString()
//           : null,
//       };

//       const createdTask = await createTask(taskData);

//       const newTaskItem: Task = {
//         id: createdTask.task_id.toString(),
//         userId: userId!,
//         heading: newTask.heading,
//         text: newTask.text,
//         endTime: newTask.endTime ? new Date(newTask.endTime) : null,
//         createDate: new Date(),
//         status: 'pending',
//       };

//       setTasks((prev) => [newTaskItem, ...prev]);
//       setNewTask({ heading: '', text: '', endTime: '' });
//       setShowAddForm(false);
//       setError(null);
//       toast.success('Task added successfully');
//     } catch (err) {
//       setError('Failed to create task');
//       toast.error('Failed to create task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, add: false });
//     }
//   };

//   const handleEditTask = async () => {
//     if (!editingTask || !editingTask.heading.trim()) {
//       setError('Task heading is required');
//       toast.error('Task heading is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, edit: true });
//       const taskData = {
//         task_text: editingTask.heading,
//         end_time: editingTask.endTime
//           ? editingTask.endTime.toISOString()
//           : null,
//         status: editingTask.status,
//       };

//       await updateTask(editingTask.id, taskData);

//       setTasks((prev) =>
//         prev
//           .map((task) => (task.id === editingTask.id ? editingTask : task))
//           .sort((a, b) => {
//             if (a.status === b.status) {
//               return b.createDate.getTime() - a.createDate.getTime();
//             }
//             return a.status === 'pending' ? -1 : 1;
//           }),
//       );

//       setEditingTask(null);
//       setError(null);
//       setShowAddForm(false);
//       toast.success('Task updated successfully');
//     } catch (err) {
//       setError('Failed to update task');
//       toast.error('Failed to update task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, edit: false });
//     }
//   };
//   const handleToggleStatus = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, toggle: id });
//       await updateTaskStatus(id);
//       setTasks(
//         tasks.map((task) =>
//           task.id === id
//             ? {
//                 ...task,
//                 status: task.status === 'pending' ? 'completed' : 'pending',
//               }
//             : task,
//         ),
//       );
//       toast.success('Task status updated');
//     } catch (err) {
//       setError('Failed to update task status');
//       toast.error('Failed to update task status');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, toggle: '' });
//     }
//   };

 
//   const handleDeleteTask = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, delete: id });
//       await deleteTask(id);
//       setTasks((prev) => prev.filter((task) => task.id !== id));
//       toast.success('Task deleted successfully');
//     } catch (err) {
//       setError('Failed to delete task');
//       toast.error('Failed to delete task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, delete: '' });
//     }
//   };

//   const handleDeleteAllCompleted = async () => {
//     if (!tasks.some((task) => task.status === 'completed')) {
//       toast.info('No completed tasks to delete');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, deleteAll: true });
//       await deleteCompletedTasks(userId!);
//       setTasks((prev) => prev.filter((task) => task.status !== 'completed'));
//       toast.success('All completed tasks deleted');
//     } catch (err) {
//       setError('Failed to delete completed tasks');
//       toast.error('Failed to delete completed tasks');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, deleteAll: false });
//     }
//   };

//   const startEditing = (task: Task) => {
//     setEditingTask({ ...task });
//     setShowAddForm(true);
//   };

//   const pendingTasks = tasks.filter((task) => task.status === 'pending');
//   const completedTasks = tasks.filter((task) => task.status === 'completed');

//   if (loading) {
//     return <div className="mt-10 flex justify-center">Loading tasks...</div>;
//   }

//   return (

//     <>
//     <ToastContainer/>
//     <div className="mt-4 md:mt-10">
//       {/* Header Section */}
//       <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 pb-2 pt-4  md:flex-row md:items-center md:justify-between">
//         <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
//           Task Manager ({pendingTasks.length} pending, {completedTasks.length}{' '}
//           completed)
//         </h1>
//         <div className="flex gap-3">
//           {!showAddForm && (
//             <button
//               onClick={() => {
//                 setEditingTask(null);
//                 setShowAddForm(true);
//               }}
//               className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-800 md:text-base"
//             >
//               <FiPlus /> Add New Task
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="pb-6">
//         {/* Add/Edit Form - Positioned at top */}
//         {showAddForm && (
//           <div
//             ref={formRef}
//             className="sticky top-20 z-10 mb-6 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 md:top-24 md:p-6"
//           >
//             <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//               {editingTask ? 'Edit Task' : 'Add New Task'}
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                   Task Description*
//                 </label>
//                 <textarea
//                   value={editingTask ? editingTask.heading : newTask.heading}
//                   onChange={(e) =>
//                     editingTask
//                       ? setEditingTask({
//                           ...editingTask,
//                           heading: e.target.value,
//                         })
//                       : setNewTask({ ...newTask, heading: e.target.value })
//                   }
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//                   placeholder="Write your Task Description here..."
//                 ></textarea>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                   Due Date
//                 </label>
//                 <div className="relative">
//                   <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
//                     <FiCalendar className="h-4 w-4 text-gray-500" />
//                   </div>
//                   <input
//                     type="datetime-local"
//                     value={
//                       editingTask
//                         ? editingTask.endTime
//                           ? format(editingTask.endTime, "yyyy-MM-dd'T'HH:mm")
//                           : ''
//                         : newTask.endTime
//                     }
//                     onChange={(e) =>
//                       editingTask
//                         ? setEditingTask({
//                             ...editingTask,
//                             endTime: e.target.value
//                               ? new Date(e.target.value)
//                               : null,
//                           })
//                         : setNewTask({ ...newTask, endTime: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 p-2.5 ps-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setShowAddForm(false);
//                     setEditingTask(null);
//                     setError(null);
//                   }}
//                   className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:px-4 md:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={editingTask ? handleEditTask : handleAddTask}
//                   disabled={
//                     editingTask
//                       ? !editingTask.heading.trim()
//                       : !newTask.heading.trim()
//                   }
//                   className={`flex items-center justify-center rounded-md px-3 py-2 text-white md:px-4 ${
//                     (
//                       editingTask
//                         ? editingTask.heading.trim()
//                         : newTask.heading.trim()
//                     )
//                       ? 'bg-blue-900 hover:bg-blue-800'
//                       : 'cursor-not-allowed bg-blue-400'
//                   } min-w-[100px] text-sm transition-colors md:text-base`}
//                 >
//                   {buttonLoading.add || buttonLoading.edit ? (
//                     <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                   ) : editingTask ? (
//                     'Update Task'
//                   ) : (
//                     'Add Task'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tasks List */}
//         <div className="space-y-3 md:space-y-4">
//           {tasks.length === 0 ? (
//             <div className="rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900 md:p-8">
//               <p className="text-gray-500 dark:text-gray-400">
//                 No tasks yet. Add your first task!
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* Pending Tasks */}
//               {pendingTasks.length > 0 && (
//                 <div className="mb-6">
//                   <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                     Pending Tasks ({pendingTasks.length})
//                   </h2>
//                   <div className="space-y-3 md:space-y-4">
//                     {pendingTasks.map((task) => (
//                       <div
//                         key={task.id}
//                         className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                           task.status === 'completed'
//                             ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                             : 'border-transparent'
//                         }`}
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="flex-1">
//                             <h3
//                               className={`text-base font-semibold md:text-lg ${
//                                 task.status === 'completed'
//                                   ? 'text-green-700 line-through dark:text-green-400'
//                                   : 'text-gray-800 dark:text-white'
//                               }`}
//                             >
//                               {task.heading}
//                             </h3>
//                             {task.text && (
//                               <p
//                                 className={`mt-1 text-sm ${
//                                   task.status === 'completed'
//                                     ? 'text-green-600 dark:text-green-300'
//                                     : 'text-gray-600 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {task.text}
//                               </p>
//                             )}
//                           </div>
//                           <div className="flex gap-1 md:gap-2">
//                             <button
//                               onClick={() => startEditing(task)}
//                               className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                               title="Edit task"
//                             >
//                               <FiEdit size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(task.id)}
//                               disabled={buttonLoading.toggle === task.id}
//                               className={`rounded-full p-1 md:p-2 ${
//                                 task.status === 'completed'
//                                   ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                   : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                               } flex items-center justify-center transition-opacity hover:opacity-80`}
//                               title={
//                                 task.status === 'completed'
//                                   ? 'Mark pending'
//                                   : 'Mark complete'
//                               }
//                             >
//                               {buttonLoading.toggle === task.id ? (
//                                 <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                               ) : (
//                                 <FiCheck size={16} />
//                               )}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteTask(task.id)}
//                               disabled={buttonLoading.delete === task.id}
//                               className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                               title="Delete task"
//                             >
//                               {buttonLoading.delete === task.id ? (
//                                 <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                               ) : (
//                                 <FiTrash2 size={16} />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                         <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                           <span>
//                             Created:{' '}
//                             {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                           </span>
//                           {task.endTime && (
//                             <span className="flex items-center gap-1">
//                               <FiCalendar size={12} />
//                               Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Completed Tasks */}
//               {completedTasks.length > 0 && (
//                 <div>
//                   <div className="mb-3 flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                       Completed Tasks ({completedTasks.length})
//                     </h2>
                  
//                   </div>
//                   <div className="space-y-3 md:space-y-4">
//                     {completedTasks.map((task) => (
//                       <div
//                         key={task.id}
//                         className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                           task.status === 'completed'
//                             ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                             : 'border-transparent'
//                         }`}
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="flex-1">
//                             <h3
//                               className={`text-base font-semibold md:text-lg ${
//                                 task.status === 'completed'
//                                   ? 'text-green-700 line-through dark:text-green-400'
//                                   : 'text-gray-800 dark:text-white'
//                               }`}
//                             >
//                               {task.heading}
//                             </h3>
//                             {task.text && (
//                               <p
//                                 className={`mt-1 text-sm ${
//                                   task.status === 'completed'
//                                     ? 'text-green-600 dark:text-green-300'
//                                     : 'text-gray-600 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {task.text}
//                               </p>
//                             )}
//                           </div>
//                           <div className="flex gap-1 md:gap-2">
//                             <button
//                               onClick={() => startEditing(task)}
//                               className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                               title="Edit task"
//                             >
//                               <FiEdit size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(task.id)}
//                               disabled={buttonLoading.toggle === task.id}
//                               className={`rounded-full p-1 md:p-2 ${
//                                 task.status === 'completed'
//                                   ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                   : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                               } flex items-center justify-center transition-opacity hover:opacity-80`}
//                               title={
//                                 task.status === 'completed'
//                                   ? 'Mark pending'
//                                   : 'Mark complete'
//                               }
//                             >
//                               {buttonLoading.toggle === task.id ? (
//                                 <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                               ) : (
//                                 <FiCheck size={16} />
//                               )}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteTask(task.id)}
//                               disabled={buttonLoading.delete === task.id}
//                               className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                               title="Delete task"
//                             >
//                               {buttonLoading.delete === task.id ? (
//                                 <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                               ) : (
//                                 <FiTrash2 size={16} />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                         <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                           <span>
//                             Created:{' '}
//                             {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                           </span>
//                           {task.endTime && (
//                             <span className="flex items-center gap-1">
//                               <FiCalendar size={12} />
//                               Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {completedTasks.length > 0 && (
//                     <div className='flex justify-end mt-6'>
//                       <button
//                         onClick={handleDeleteAllCompleted}
//                         disabled={buttonLoading.deleteAll}
//                         className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700 md:text-base"
//                       >
//                         {buttonLoading.deleteAll ? (
//                           <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                         ) : (
//                           <>
//                             <FiTrash2 /> Clear Completed
//                           </>
//                         )}
//                       </button>
//                     </div>
//                     )}
//                 </div>
//               )}
//             </>
            
//           )}
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default TaskManager;




// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { FiPlus, FiTrash2, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi';
// import { format, parseISO } from 'date-fns';
// import {
//   createTask,
//   deleteTask,
//   getTasksByUserId,
//   updateTaskStatus,
//   updateTask,
//   deleteCompletedTasks,
// } from 'services/apiCollection';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type TaskStatus = 'pending' | 'completed';

// interface Task {
//   id: string;
//   userId: string;
//   heading: string;
//   text: string;
//   endTime: Date | null;
//   createDate: Date;
//   status: TaskStatus;
// }

// interface NewTask {
//   heading: string;
//   text: string;
//   endTime: string;
// }

// interface ButtonLoading {
//   add: boolean;
//   edit: boolean;
//   delete: string;
//   toggle: string;
//   deleteAll: boolean;
// }

// const TaskManager = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState<NewTask>({
//     heading: '',
//     text: '',
//     endTime: '',
//   });
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [buttonLoading, setButtonLoading] = useState<ButtonLoading>({
//     add: false,
//     edit: false,
//     delete: '',
//     toggle: '',
//     deleteAll: false,
//   });

//   const formRef = useRef<HTMLDivElement>(null);
//   const userId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   useEffect(() => {
//     if (!userId) return;
//     const fetchTasks = async () => {
//       try {
//         const apiTasks = await getTasksByUserId(userId);
//         const formattedTasks = apiTasks.map((task: any) => ({
//           id: task.task_id.toString(),
//           userId: task.user_id,
//           heading: task.task_text,
//           text: '',
//           endTime: task.end_time ? parseISO(task.end_time) : null,
//           createDate: parseISO(task.create_date),
//           status: task.status as TaskStatus,
//         }));

//         const sortedTasks = formattedTasks.sort((a: Task, b: Task) => {
//           if (a.status === b.status) {
//             return b.createDate.getTime() - a.createDate.getTime();
//           }
//           return a.status === 'pending' ? -1 : 1;
//         });

//         setTasks(sortedTasks);
//       } catch (err) {
//         setError('Failed to load tasks');
//         toast.error('Failed to load tasks');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [userId]);

//   useEffect(() => {
//     if (showAddForm) {
//       // Prevent body scrolling
//       document.body.style.overflow = 'hidden';
      
//       // Scroll to form using manual calculation for better reliability
//       if (formRef.current) {
//         requestAnimationFrame(() => {
//           const element = formRef.current;
//           if (element) {
//             const elementPosition = element.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for header
            
//             window.scrollTo({
//               top: offsetPosition,
//               behavior: 'smooth'
//             });

//             // Focus first input for better accessibility
//             const firstInput = element.querySelector('input, textarea');
//             if (firstInput) {
//               (firstInput as HTMLElement).focus();
//             }
//           }
//         });
//       }
//     } else {
//       // Restore body scrolling
//       document.body.style.overflow = 'auto';
//     }
  
//     // Cleanup function to restore scrolling when component unmounts
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [showAddForm, editingTask]);

//   const handleAddTask = async () => {
//     if (!newTask.heading.trim() || !newTask.endTime.trim()) {
//       setError('Task Description* and Due Date is required');
//       toast.error('Task Description* and Due Date is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, add: true });
//       const taskData = {
//         user_id: userId,
//         task_text: newTask.heading,
//         end_time: newTask.endTime
//           ? new Date(newTask.endTime).toISOString()
//           : null,
//       };

//       const createdTask = await createTask(taskData);

//       const newTaskItem: Task = {
//         id: createdTask.task_id.toString(),
//         userId: userId!,
//         heading: newTask.heading,
//         text: newTask.text,
//         endTime: newTask.endTime ? new Date(newTask.endTime) : null,
//         createDate: new Date(),
//         status: 'pending',
//       };

//       setTasks((prev) => [newTaskItem, ...prev]);
//       setNewTask({ heading: '', text: '', endTime: '' });
//       setShowAddForm(false);
//       setError(null);
//       toast.success('Task added successfully');
//     } catch (err) {
//       setError('Failed to create task');
//       toast.error('Failed to create task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, add: false });
//     }
//   };

//   const handleEditTask = async () => {
//     if (!editingTask || !editingTask.heading.trim()) {
//       setError('Task heading is required');
//       toast.error('Task heading is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, edit: true });
//       const taskData = {
//         task_text: editingTask.heading,
//         end_time: editingTask.endTime
//           ? editingTask.endTime.toISOString()
//           : null,
//         status: editingTask.status,
//       };

//       await updateTask(editingTask.id, taskData);

//       setTasks((prev) =>
//         prev
//           .map((task) => (task.id === editingTask.id ? editingTask : task))
//           .sort((a, b) => {
//             if (a.status === b.status) {
//               return b.createDate.getTime() - a.createDate.getTime();
//             }
//             return a.status === 'pending' ? -1 : 1;
//           }),
//       );

//       setEditingTask(null);
//       setError(null);
//       setShowAddForm(false);
//       toast.success('Task updated successfully');
//     } catch (err) {
//       setError('Failed to update task');
//       toast.error('Failed to update task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, edit: false });
//     }
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, toggle: id });
//       await updateTaskStatus(id);
//       setTasks(
//         tasks.map((task) =>
//           task.id === id
//             ? {
//                 ...task,
//                 status: task.status === 'pending' ? 'completed' : 'pending',
//               }
//             : task,
//         ),
//       );
//       toast.success('Task status updated');
//     } catch (err) {
//       setError('Failed to update task status');
//       toast.error('Failed to update task status');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, toggle: '' });
//     }
//   };

//   const handleDeleteTask = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, delete: id });
//       await deleteTask(id);
//       setTasks((prev) => prev.filter((task) => task.id !== id));
//       toast.success('Task deleted successfully');
//     } catch (err) {
//       setError('Failed to delete task');
//       toast.error('Failed to delete task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, delete: '' });
//     }
//   };

//   const handleDeleteAllCompleted = async () => {
//     if (!tasks.some((task) => task.status === 'completed')) {
//       toast.info('No completed tasks to delete');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, deleteAll: true });
//       await deleteCompletedTasks(userId!);
//       setTasks((prev) => prev.filter((task) => task.status !== 'completed'));
//       toast.success('All completed tasks deleted');
//     } catch (err) {
//       setError('Failed to delete completed tasks');
//       toast.error('Failed to delete completed tasks');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, deleteAll: false });
//     }
//   };

//   const startEditing = (task: Task) => {
//     setEditingTask({ ...task });
//     setShowAddForm(true);
//   };

//   const pendingTasks = tasks.filter((task) => task.status === 'pending');
//   const completedTasks = tasks.filter((task) => task.status === 'completed');

//   if (loading) {
//     return <div className="mt-10 flex justify-center">Loading tasks...</div>;
//   }

//   return (
//     <>
// <ToastContainer autoClose={2000} />
//       <div className="mt-4 md:mt-10">
//         {/* Header Section */}
//         <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 pb-2 pt-4 md:flex-row md:items-center md:justify-between">
//           <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
//             Task Manager ({pendingTasks.length} pending, {completedTasks.length} completed)
//           </h1>
//           <div className="flex gap-3">
//             {!showAddForm && (
//               <button
//                 onClick={() => {
//                   setEditingTask(null);
//                   setShowAddForm(true);
//                 }}
//                 className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-800 md:text-base"
//               >
//                 <FiPlus /> Add New Task
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="pb-6">
//           {/* Add/Edit Form - Now with better scroll behavior */}
//           {showAddForm && (
//             <div
//               ref={formRef}
//               className="mb-6 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 md:p-6"
//             >
//               <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                 {editingTask ? 'Edit Task' : 'Add New Task'}
//               </h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                     Task Description*
//                   </label>
//                   <textarea
//                     value={editingTask ? editingTask.heading : newTask.heading}
//                     onChange={(e) =>
//                       editingTask
//                         ? setEditingTask({
//                             ...editingTask,
//                             heading: e.target.value,
//                           })
//                         : setNewTask({ ...newTask, heading: e.target.value })
//                     }
//                     className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//                     placeholder="Write your Task Description here..."
//                   ></textarea>
//                 </div>
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                     Due Date
//                   </label>
//                   <div className="relative">
//                     <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
//                       <FiCalendar className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input
//                       type="datetime-local"
//                       value={
//                         editingTask
//                           ? editingTask.endTime
//                             ? format(editingTask.endTime, "yyyy-MM-dd'T'HH:mm")
//                             : ''
//                           : newTask.endTime
//                       }
//                       onChange={(e) =>
//                         editingTask
//                           ? setEditingTask({
//                               ...editingTask,
//                               endTime: e.target.value
//                                 ? new Date(e.target.value)
//                                 : null,
//                             })
//                           : setNewTask({ ...newTask, endTime: e.target.value })
//                       }
//                       className="w-full rounded-lg border border-gray-300 p-2.5 ps-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-2">
//                   <button
//                     onClick={() => {
//                       setShowAddForm(false);
//                       setEditingTask(null);
//                       setError(null);
//                     }}
//                     className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:px-4 md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={editingTask ? handleEditTask : handleAddTask}
//                     disabled={
//                       editingTask
//                         ? !editingTask.heading.trim()
//                         : !newTask.heading.trim()
//                     }
//                     className={`flex items-center justify-center rounded-md px-3 py-2 text-white md:px-4 ${
//                       (
//                         editingTask
//                           ? editingTask.heading.trim()
//                           : newTask.heading.trim()
//                       )
//                         ? 'bg-blue-900 hover:bg-blue-800'
//                         : 'cursor-not-allowed bg-blue-400'
//                     } min-w-[100px] text-sm transition-colors md:text-base`}
//                   >
//                     {buttonLoading.add || buttonLoading.edit ? (
//                       <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                     ) : editingTask ? (
//                       'Update Task'
//                     ) : (
//                       'Add Task'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Tasks List */}
//           <div className="space-y-3 md:space-y-4">
//             {tasks.length === 0 ? (
//               <div className="rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900 md:p-8">
//                 <p className="text-gray-500 dark:text-gray-400">
//                   No tasks yet. Add your first task!
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {/* Pending Tasks */}
//                 {pendingTasks.length > 0 && (
//                   <div className="mb-6">
//                     <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                       Pending Tasks ({pendingTasks.length})
//                     </h2>
//                     <div className="space-y-3 md:space-y-4">
//                       {pendingTasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                             task.status === 'completed'
//                               ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                               : 'border-transparent'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               <h3
//                                 className={`text-base font-semibold md:text-lg ${
//                                   task.status === 'completed'
//                                     ? 'text-green-700 line-through dark:text-green-400'
//                                     : 'text-gray-800 dark:text-white'
//                                 }`}
//                               >
//                                 {task.heading}
//                               </h3>
//                               {task.text && (
//                                 <p
//                                   className={`mt-1 text-sm ${
//                                     task.status === 'completed'
//                                       ? 'text-green-600 dark:text-green-300'
//                                       : 'text-gray-600 dark:text-gray-300'
//                                   }`}
//                                 >
//                                   {task.text}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex gap-1 md:gap-2">
//                               <button
//                                 onClick={() => startEditing(task)}
//                                 className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                                 title="Edit task"
//                               >
//                                 <FiEdit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleToggleStatus(task.id)}
//                                 disabled={buttonLoading.toggle === task.id}
//                                 className={`rounded-full p-1 md:p-2 ${
//                                   task.status === 'completed'
//                                     ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                     : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                                 } flex items-center justify-center transition-opacity hover:opacity-80`}
//                                 title={
//                                   task.status === 'completed'
//                                     ? 'Mark pending'
//                                     : 'Mark complete'
//                                 }
//                               >
//                                 {buttonLoading.toggle === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiCheck size={16} />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteTask(task.id)}
//                                 disabled={buttonLoading.delete === task.id}
//                                 className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                                 title="Delete task"
//                               >
//                                 {buttonLoading.delete === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiTrash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                           <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                             <span>
//                               Created:{' '}
//                               {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                             </span>
//                             {task.endTime && (
//                               <span className="flex items-center gap-1">
//                                 <FiCalendar size={12} />
//                                 Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Completed Tasks */}
//                 {completedTasks.length > 0 && (
//                   <div>
//                     <div className="mb-5 flex items-center justify-between">
//                       <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                         Completed Tasks ({completedTasks.length})
//                       </h2>
//                          {completedTasks.length > 0 && (
//                       <div className='flex justify-end'>
//                         <button
//                           onClick={handleDeleteAllCompleted}
//                           disabled={buttonLoading.deleteAll}
//                           className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700 md:text-base"
//                         >
//                           {buttonLoading.deleteAll ? (
//                             <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                           ) : (
//                             <>
//                               <FiTrash2 /> Clear Completed
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     )}
//                     </div>
//                     <div className="space-y-3 md:space-y-4">
//                       {completedTasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                             task.status === 'completed'
//                               ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                               : 'border-transparent'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               <h3
//                                 className={`text-base font-semibold md:text-lg ${
//                                   task.status === 'completed'
//                                     ? 'text-green-700 line-through dark:text-green-400'
//                                     : 'text-gray-800 dark:text-white'
//                                 }`}
//                               >
//                                 {task.heading}
//                               </h3>
//                               {task.text && (
//                                 <p
//                                   className={`mt-1 text-sm ${
//                                     task.status === 'completed'
//                                       ? 'text-green-600 dark:text-green-300'
//                                       : 'text-gray-600 dark:text-gray-300'
//                                   }`}
//                                 >
//                                   {task.text}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex gap-1 md:gap-2">
//                               <button
//                                 onClick={() => startEditing(task)}
//                                 className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                                 title="Edit task"
//                               >
//                                 <FiEdit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleToggleStatus(task.id)}
//                                 disabled={buttonLoading.toggle === task.id}
//                                 className={`rounded-full p-1 md:p-2 ${
//                                   task.status === 'completed'
//                                     ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                     : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                                 } flex items-center justify-center transition-opacity hover:opacity-80`}
//                                 title={
//                                   task.status === 'completed'
//                                     ? 'Mark pending'
//                                     : 'Mark complete'
//                                 }
//                               >
//                                 {buttonLoading.toggle === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiCheck size={16} />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteTask(task.id)}
//                                 disabled={buttonLoading.delete === task.id}
//                                 className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                                 title="Delete task"
//                               >
//                                 {buttonLoading.delete === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiTrash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                           <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                             <span>
//                               Created:{' '}
//                               {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                             </span>
//                             {task.endTime && (
//                               <span className="flex items-center gap-1">
//                                 <FiCalendar size={12} />
//                                 Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

                 
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TaskManager;







'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import {
  createTask,
  deleteTask,
  getTasksByUserId,
  updateTaskStatus,
  updateTask,
  deleteCompletedTasks,
} from 'services/apiCollection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type TaskStatus = 'pending' | 'completed';

interface Task {
  id: string;
  userId: string;
  heading: string;
  text: string;
  endTime: Date | null;
  createDate: Date;
  status: TaskStatus;
}

interface NewTask {
  heading: string;
  text: string;
  endTime: string;
}

interface ButtonLoading {
  add: boolean;
  edit: boolean;
  delete: string;
  toggle: string;
  deleteAll: boolean;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    heading: '',
    text: '',
    endTime: '',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<ButtonLoading>({
    add: false,
    edit: false,
    delete: '',
    toggle: '',
    deleteAll: false,
  });

  const formRef = useRef<HTMLDivElement>(null);
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

  useEffect(() => {
    if (!userId) return;
    const fetchTasks = async () => {
      try {
        const apiTasks = await getTasksByUserId(userId);
        const formattedTasks = apiTasks.map((task: any) => ({
          id: task.task_id.toString(),
          userId: task.user_id,
          heading: task.task_text,
          text: '',
          endTime: task.end_time ? parseISO(task.end_time) : null,
          createDate: parseISO(task.create_date),
          status: task.status as TaskStatus,
        }));

        const sortedTasks = formattedTasks.sort((a: Task, b: Task) => {
          if (a.status === b.status) {
            return b.createDate.getTime() - a.createDate.getTime();
          }
          return a.status === 'pending' ? -1 : 1;
        });

        setTasks(sortedTasks);
      } catch (err) {
        setError('Failed to load tasks');
        toast.error('Failed to load tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
      if (formRef.current) {
        requestAnimationFrame(() => {
          const element = formRef.current;
          if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
            const firstInput = element.querySelector('input, textarea');
            if (firstInput) {
              (firstInput as HTMLElement).focus();
            }
          }
        });
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddForm, editingTask]);

  const handleAddTask = async () => {
    if (!newTask.heading.trim() || !newTask.endTime.trim()) {
      setError('Task Description* and Due Date is required');
      toast.error('Task Description* and Due Date is required');
      return;
    }

    try {
      setButtonLoading({ ...buttonLoading, add: true });
      const taskData = {
        user_id: userId,
        task_text: newTask.heading,
        end_time: newTask.endTime
          ? new Date(newTask.endTime).toISOString()
          : null,
      };

      const createdTask = await createTask(taskData);

      const newTaskItem: Task = {
        id: createdTask.task_id.toString(),
        userId: userId!,
        heading: newTask.heading,
        text: newTask.text,
        endTime: newTask.endTime ? new Date(newTask.endTime) : null,
        createDate: new Date(),
        status: 'pending',
      };

      setTasks((prev) => [newTaskItem, ...prev]);
      setNewTask({ heading: '', text: '', endTime: '' });
      setShowAddForm(false);
      setError(null);
      toast.success('Task added successfully');
    } catch (err) {
      setError('Failed to create task');
      toast.error('Failed to create task');
      console.error(err);
    } finally {
      setButtonLoading({ ...buttonLoading, add: false });
    }
  };

  const handleEditTask = async () => {
    if (!editingTask || !editingTask.heading.trim()) {
      setError('Task heading is required');
      toast.error('Task heading is required');
      return;
    }

    try {
      setButtonLoading({ ...buttonLoading, edit: true });
      const taskData = {
        task_text: editingTask.heading,
        end_time: editingTask.endTime
          ? editingTask.endTime.toISOString()
          : null,
        status: editingTask.status,
      };

      await updateTask(editingTask.id, taskData);

      setTasks((prev) =>
        prev
          .map((task) => (task.id === editingTask.id ? editingTask : task))
          .sort((a, b) => {
            if (a.status === b.status) {
              return b.createDate.getTime() - a.createDate.getTime();
            }
            return a.status === 'pending' ? -1 : 1;
          }),
      );

      setEditingTask(null);
      setError(null);
      setShowAddForm(false);
      toast.success('Task updated successfully');
    } catch (err) {
      setError('Failed to update task');
      toast.error('Failed to update task');
      console.error(err);
    } finally {
      setButtonLoading({ ...buttonLoading, edit: false });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setButtonLoading({ ...buttonLoading, toggle: id });
      await updateTaskStatus(id);
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status: task.status === 'pending' ? 'completed' : 'pending',
              }
            : task,
        ),
      );
      toast.success('Task status updated');
    } catch (err) {
      setError('Failed to update task status');
      toast.error('Failed to update task status');
      console.error(err);
    } finally {
      setButtonLoading({ ...buttonLoading, toggle: '' });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setButtonLoading({ ...buttonLoading, delete: id });
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
      console.error(err);
    } finally {
      setButtonLoading({ ...buttonLoading, delete: '' });
    }
  };

  const handleDeleteAllCompleted = async () => {
    if (!tasks.some((task) => task.status === 'completed')) {
      toast.info('No completed tasks to delete');
      return;
    }

    try {
      setButtonLoading({ ...buttonLoading, deleteAll: true });
      await deleteCompletedTasks(userId!);
      setTasks((prev) => prev.filter((task) => task.status !== 'completed'));
      toast.success('All completed tasks deleted');
    } catch (err) {
      setError('Failed to delete completed tasks');
      toast.error('Failed to delete completed tasks');
      console.error(err);
    } finally {
      setButtonLoading({ ...buttonLoading, deleteAll: false });
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask({ ...task });
    setShowAddForm(true);
  };

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  // Function to check if a task is overdue
  const isTaskOverdue = (task: Task) => {
    if (!task.endTime || task.status === 'completed') return false;
    const currentDate = new Date();
    return task.endTime < currentDate;
  };

  if (loading) {
    return <div className="mt-10 flex justify-center">Loading tasks...</div>;
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="mt-4 md:mt-10">
        {/* Header Section */}
        <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 pb-2 pt-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
            Task Manager ({pendingTasks.length} pending, {completedTasks.length} completed)
          </h1>
          <div className="flex gap-3">
            {!showAddForm && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowAddForm(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-800 md:text-base"
              >
                <FiPlus /> Add New Task
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="pb-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div
              ref={formRef}
              className="mb-6 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 md:p-6"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
                    Task Description*
                  </label>
                  <textarea
                    value={editingTask ? editingTask.heading : newTask.heading}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({
                            ...editingTask,
                            heading: e.target.value,
                          })
                        : setNewTask({ ...newTask, heading: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Write your Task Description here..."
                  ></textarea>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
                    Due Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                      <FiCalendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="datetime-local"
                      value={
                        editingTask
                          ? editingTask.endTime
                            ? format(editingTask.endTime, "yyyy-MM-dd'T'HH:mm")
                            : ''
                          : newTask.endTime
                      }
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({
                              ...editingTask,
                              endTime: e.target.value
                                ? new Date(e.target.value)
                                : null,
                            })
                          : setNewTask({ ...newTask, endTime: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5 ps-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTask(null);
                      setError(null);
                    }}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:px-4 md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingTask ? handleEditTask : handleAddTask}
                    disabled={
                      editingTask
                        ? !editingTask.heading.trim()
                        : !newTask.heading.trim()
                    }
                    className={`flex items-center justify-center rounded-md px-3 py-2 text-white md:px-4 ${
                      (
                        editingTask
                          ? editingTask.heading.trim()
                          : newTask.heading.trim()
                      )
                        ? 'bg-blue-900 hover:bg-blue-800'
                        : 'cursor-not-allowed bg-blue-400'
                    } min-w-[100px] text-sm transition-colors md:text-base`}
                  >
                    {buttonLoading.add || buttonLoading.edit ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                    ) : editingTask ? (
                      'Update Task'
                    ) : (
                      'Add Task'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3 md:space-y-4">
            {tasks.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900 md:p-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks yet. Add your first task!
                </p>
              </div>
            ) : (
              <>
                {/* Pending Tasks */}
                {pendingTasks.length > 0 && (
                  <div className="mb-6">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
                      Pending Tasks ({pendingTasks.length})
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
                            task.status === 'completed'
                              ? 'border-green-600 bg-green-50 dark:bg-gray-800'
                              : isTaskOverdue(task)
                              ? 'border-red-600'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3
                                className={`text-base font-semibold md:text-lg ${
                                  task.status === 'completed'
                                    ? 'text-green-700 line-through dark:text-green-400'
                                    : isTaskOverdue(task)
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-800 dark:text-white'
                                }`}
                              >
                                {task.heading}
                              </h3>
                              {task.text && (
                                <p
                                  className={`mt-1 text-sm ${
                                    task.status === 'completed'
                                      ? 'text-green-600 dark:text-green-300'
                                      : isTaskOverdue(task)
                                      ? 'text-red-500 dark:text-red-300'
                                      : 'text-gray-600 dark:text-gray-300'
                                  }`}
                                >
                                  {task.text}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 md:gap-2">
                              <button
                                onClick={() => startEditing(task)}
                                className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
                                title="Edit task"
                              >
                                <FiEdit size={16} />
                              </button>
                            
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                disabled={buttonLoading.delete === task.id}
                                className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
                                title="Delete task"
                              >
                                {buttonLoading.delete === task.id ? (
                                  <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
                                ) : (
                                  <FiTrash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
                            <span>
                              Created:{' '}
                              {format(task.createDate, 'MMM d, yyyy h:mm a')}
                            </span>
                            {task.endTime && (
                              <span
                                className={`flex items-center gap  gap-1 ${
                                  isTaskOverdue(task) ? 'text-red-600 dark:text-red-400' : ''
                                }`}
                              >
                                <FiCalendar size={12} />
                                Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
                              </span>
                            )}
                             <div className='ml-auto'>
                              <button
                                onClick={() => handleToggleStatus(task.id)}
                                disabled={buttonLoading.toggle === task.id}
                                className={`rounded-full p-1 md:p-2 ${
                                  task.status === 'completed'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                } flex items-center justify-center transition-opacity hover:opacity-80`}
                                title={
                                  task.status === 'completed'
                                    ? 'Mark pending'
                                    : 'Mark complete'
                                }
                              >
                                {buttonLoading.toggle === task.id ? (
                                  <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
                                ) : (
                                  <FiCheck size={16} />
                                )}
                              </button>
                          </div>
                          </div>
                         
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
                        Completed Tasks ({completedTasks.length})
                      </h2>
                      {completedTasks.length > 0 && (
                        <div className="flex justify-end">
                          <button
                            onClick={handleDeleteAllCompleted}
                            disabled={buttonLoading.deleteAll}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700 md:text-base"
                          >
                            {buttonLoading.deleteAll ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                            ) : (
                              <>
                                <FiTrash2 /> Clear Completed
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {completedTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
                            task.status === 'completed'
                              ? 'border-green-600 bg-green-50 dark:bg-gray-800'
                              : isTaskOverdue(task)
                              ? 'border-red-600'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3
                                className={`text-base font-semibold md:text-lg ${
                                  task.status === 'completed'
                                    ? 'text-green-700 line-through dark:text-green-400'
                                    : isTaskOverdue(task)
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-800 dark:text-white'
                                }`}
                              >
                                {task.heading}
                              </h3>
                              {task.text && (
                                <p
                                  className={`mt-1 text-sm ${
                                    task.status === 'completed'
                                      ? 'text-green-600 dark:text-green-300'
                                      : isTaskOverdue(task)
                                      ? 'text-red-500 dark:text-red-300'
                                      : 'text-gray-600 dark:text-gray-300'
                                  }`}
                                >
                                  {task.text}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 md:gap-2">
                              <button
                                onClick={() => startEditing(task)}
                                className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
                                title="Edit task"
                              >
                                <FiEdit size={16} />
                              </button>
                              {/* <button
                                onClick={() => handleToggleStatus(task.id)}
                                disabled={buttonLoading.toggle === task.id}
                                className={`rounded-full p-1 md:p-2 ${
                                  task.status === 'completed'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                } flex items-center justify-center transition-opacity hover:opacity-80`}
                                title={
                                  task.status === 'completed'
                                    ? 'Mark pending'
                                    : 'Mark complete'
                                }
                              >
                                {buttonLoading.toggle === task.id ? (
                                  <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
                                ) : (
                                  <FiCheck size={16} />
                                )}
                              </button> */}
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                disabled={buttonLoading.delete === task.id}
                                className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
                                title="Delete task"
                              >
                                {buttonLoading.delete === task.id ? (
                                  <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
                                ) : (
                                  <FiTrash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
                            <span>
                              Created:{' '}
                              {format(task.createDate, 'MMM d, yyyy h:mm a')}
                            </span>
                            {task.endTime && (
                              <span
                                className={`flex items-center gap-1 ${
                                  isTaskOverdue(task) ? 'text-red-600 dark:text-red-400' : ''
                                }`}
                              >
                                <FiCalendar size={12} />
                                Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
                              </span>
                            )}
                            <div className='ml-auto'>
                              <button
                                onClick={() => handleToggleStatus(task.id)}
                                disabled={buttonLoading.toggle === task.id}
                                className={`rounded-full p-1 md:p-2 ${
                                  task.status === 'completed'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                } flex items-center justify-center transition-opacity hover:opacity-80`}
                                title={
                                  task.status === 'completed'
                                    ? 'Mark pending'
                                    : 'Mark complete'
                                }
                              >
                                {buttonLoading.toggle === task.id ? (
                                  <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
                                ) : (
                                  <FiCheck size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManager;


// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { FiPlus, FiTrash2, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi';
// import { format, parseISO } from 'date-fns';
// import {
//   createTask,
//   deleteTask,
//   getTasksByUserId,
//   updateTaskStatus,
//   updateTask,
//   deleteCompletedTasks,
// } from 'services/apiCollection';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type TaskStatus = 'pending' | 'completed';

// interface Task {
//   id: string;
//   userId: string;
//   heading: string;
//   text: string;
//   endTime: Date | null;
//   createDate: Date;
//   status: TaskStatus;
// }

// interface NewTask {
//   heading: string;
//   text: string;
//   endTime: string;
// }

// interface ButtonLoading {
//   add: boolean;
//   edit: boolean;
//   delete: string;
//   toggle: string;
//   deleteAll: boolean;
// }

// const TaskManager = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState<NewTask>({
//     heading: '',
//     text: '',
//     endTime: '',
//   });
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [buttonLoading, setButtonLoading] = useState<ButtonLoading>({
//     add: false,
//     edit: false,
//     delete: '',
//     toggle: '',
//     deleteAll: false,
//   });
//   const [sortBy, setSortBy] = useState<'status' | 'createDate' | 'dueDate'>('status');

//   const formRef = useRef<HTMLDivElement>(null);
//   const userId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   useEffect(() => {
//     if (!userId) return;
//     const fetchTasks = async () => {
//       try {
//         const apiTasks = await getTasksByUserId(userId);
//         const formattedTasks = apiTasks.map((task: any) => ({
//           id: task.task_id.toString(),
//           userId: task.user_id,
//           heading: task.task_text,
//           text: '',
//           endTime: task.end_time ? parseISO(task.end_time) : null,
//           createDate: parseISO(task.create_date),
//           status: task.status as TaskStatus,
//         }));
//         setTasks(formattedTasks);
//       } catch (err) {
//         setError('Failed to load tasks');
//         toast.error('Failed to load tasks');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [userId]);

//   useEffect(() => {
//     if (showAddForm) {
//       document.body.style.overflow = 'hidden';
//       if (formRef.current) {
//         requestAnimationFrame(() => {
//           const element = formRef.current;
//           if (element) {
//             const elementPosition = element.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.pageYOffset - 100;
//             window.scrollTo({
//               top: offsetPosition,
//               behavior: 'smooth',
//             });
//             const firstInput = element.querySelector('input, textarea');
//             if (firstInput) {
//               (firstInput as HTMLElement).focus();
//             }
//           }
//         });
//       }
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [showAddForm, editingTask]);

//   const sortTasks = (tasks: Task[]) => {
//     return [...tasks].sort((a, b) => {
//       if (sortBy === 'status') {
//         if (a.status === b.status) {
//           return b.createDate.getTime() - a.createDate.getTime();
//         }
//         return a.status === 'pending' ? -1 : 1;
//       }
//       if (sortBy === 'createDate') {
//         return b.createDate.getTime() - a.createDate.getTime();
//       }
//       if (sortBy === 'dueDate') {
//         const aTime = a.endTime ? a.endTime.getTime() : Infinity;
//         const bTime = b.endTime ? b.endTime.getTime() : Infinity;
//         return aTime - bTime;
//       }
//       return 0;
//     });
//   };

//   const handleAddTask = async () => {
//     if (!newTask.heading.trim() || !newTask.endTime.trim()) {
//       setError('Task Description* and Due Date is required');
//       toast.error('Task Description* and Due Date is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, add: true });
//       const taskData = {
//         user_id: userId,
//         task_text: newTask.heading,
//         end_time: newTask.endTime
//           ? new Date(newTask.endTime).toISOString()
//           : null,
//       };

//       const createdTask = await createTask(taskData);

//       const newTaskItem: Task = {
//         id: createdTask.task_id.toString(),
//         userId: userId!,
//         heading: newTask.heading,
//         text: newTask.text,
//         endTime: newTask.endTime ? new Date(newTask.endTime) : null,
//         createDate: new Date(),
//         status: 'pending',
//       };

//       setTasks((prev) => [newTaskItem, ...prev]);
//       setNewTask({ heading: '', text: '', endTime: '' });
//       setShowAddForm(false);
//       setError(null);
//       toast.success('Task added successfully');
//     } catch (err) {
//       setError('Failed to create task');
//       toast.error('Failed to create task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, add: false });
//     }
//   };

//   const handleEditTask = async () => {
//     if (!editingTask || !editingTask.heading.trim()) {
//       setError('Task heading is required');
//       toast.error('Task heading is required');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, edit: true });
//       const taskData = {
//         task_text: editingTask.heading,
//         end_time: editingTask.endTime
//           ? editingTask.endTime.toISOString()
//           : null,
//         status: editingTask.status,
//       };

//       await updateTask(editingTask.id, taskData);

//       setTasks((prev) =>
//         prev.map((task) => (task.id === editingTask.id ? editingTask : task)),
//       );

//       setEditingTask(null);
//       setError(null);
//       setShowAddForm(false);
//       toast.success('Task updated successfully');
//     } catch (err) {
//       setError('Failed to update task');
//       toast.error('Failed to update task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, edit: false });
//     }
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, toggle: id });
//       await updateTaskStatus(id);
//       setTasks(
//         tasks.map((task) =>
//           task.id === id
//             ? {
//                 ...task,
//                 status: task.status === 'pending' ? 'completed' : 'pending',
//               }
//             : task,
//         ),
//       );
//       toast.success('Task status updated');
//     } catch (err) {
//       setError('Failed to update task status');
//       toast.error('Failed to update task status');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, toggle: '' });
//     }
//   };

//   const handleDeleteTask = async (id: string) => {
//     try {
//       setButtonLoading({ ...buttonLoading, delete: id });
//       await deleteTask(id);
//       setTasks((prev) => prev.filter((task) => task.id !== id));
//       toast.success('Task deleted successfully');
//     } catch (err) {
//       setError('Failed to delete task');
//       toast.error('Failed to delete task');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, delete: '' });
//     }
//   };

//   const handleDeleteAllCompleted = async () => {
//     if (!tasks.some((task) => task.status === 'completed')) {
//       toast.info('No completed tasks to delete');
//       return;
//     }

//     try {
//       setButtonLoading({ ...buttonLoading, deleteAll: true });
//       await deleteCompletedTasks(userId!);
//       setTasks((prev) => prev.filter((task) => task.status !== 'completed'));
//       toast.success('All completed tasks deleted');
//     } catch (err) {
//       setError('Failed to delete completed tasks');
//       toast.error('Failed to delete completed tasks');
//       console.error(err);
//     } finally {
//       setButtonLoading({ ...buttonLoading, deleteAll: false });
//     }
//   };

//   const startEditing = (task: Task) => {
//     setEditingTask({ ...task });
//     setShowAddForm(true);
//   };

//   const sortedTasks = sortTasks(tasks);
//   const pendingTasks = sortedTasks.filter((task) => task.status === 'pending');
//   const completedTasks = sortedTasks.filter((task) => task.status === 'completed');

//   const isTaskOverdue = (task: Task) => {
//     if (!task.endTime || task.status === 'completed') return false;
//     const currentDate = new Date();
//     return task.endTime < currentDate;
//   };

//   if (loading) {
//     return <div className="mt-10 flex justify-center">Loading tasks...</div>;
//   }

//   return (
//     <>
//       <ToastContainer autoClose={2000} />
//       <div className="mt-4 md:mt-10">
//         <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 pb-2 pt-4 md:flex-row md:items-center md:justify-between">
//           <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
//             Task Manager ({pendingTasks.length} pending, {completedTasks.length} completed)
//           </h1>
//           <div className="flex gap-3">
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as 'status' | 'createDate' | 'dueDate')}
//               className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//             >
//               <option value="status">Sort by Status</option>
//               <option value="createDate">Sort by Creation Date</option>
//               <option value="dueDate">Sort by Due Date</option>
//             </select>
//             {!showAddForm && (
//               <button
//                 onClick={() => {
//                   setEditingTask(null);
//                   setShowAddForm(true);
//                 }}
//                 className="flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-800 md:text-base"
//               >
//                 <FiPlus /> Add New Task
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="pb-6">
//           {showAddForm && (
//             <div
//               ref={formRef}
//               className="mb-6 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-900 md:p-6"
//             >
//               <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                 {editingTask ? 'Edit Task' : 'Add New Task'}
//               </h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                     Task Description*
//                   </label>
//                   <textarea
//                     value={editingTask ? editingTask.heading : newTask.heading}
//                     onChange={(e) =>
//                       editingTask
//                         ? setEditingTask({
//                             ...editingTask,
//                             heading: e.target.value,
//                           })
//                         : setNewTask({ ...newTask, heading: e.target.value })
//                     }
//                     className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//                     placeholder="Write your Task Description here..."
//                   ></textarea>
//                 </div>
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
//                     Due Date
//                   </label>
//                   <div className="relative">
//                     <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
//                       <FiCalendar className="h-4 w-4 text-gray-500" />
//                     </div>
//                     <input
//                       type="datetime-local"
//                       value={
//                         editingTask
//                           ? editingTask.endTime
//                             ? format(editingTask.endTime, "yyyy-MM-dd'T'HH:mm")
//                             : ''
//                           : newTask.endTime
//                       }
//                       onChange={(e) =>
//                         editingTask
//                           ? setEditingTask({
//                               ...editingTask,
//                               endTime: e.target.value
//                                 ? new Date(e.target.value)
//                                 : null,
//                             })
//                           : setNewTask({ ...newTask, endTime: e.target.value })
//                       }
//                       className="w-full rounded-lg border border-gray-300 p-2.5 ps-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 pt-2">
//                   <button
//                     onClick={() => {
//                       setShowAddForm(false);
//                       setEditingTask(null);
//                       setError(null);
//                     }}
//                     className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:px-4 md:text-base"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={editingTask ? handleEditTask : handleAddTask}
//                     disabled={
//                       editingTask
//                         ? !editingTask.heading.trim()
//                         : !newTask.heading.trim()
//                     }
//                     className={`flex items-center justify-center rounded-md px-3 py-2 text-white md:px-4 ${
//                       (
//                         editingTask
//                           ? editingTask.heading.trim()
//                           : newTask.heading.trim()
//                       )
//                         ? 'bg-blue-900 hover:bg-blue-800'
//                         : 'cursor-not-allowed bg-blue-400'
//                     } min-w-[100px] text-sm transition-colors md:text-base`}
//                   >
//                     {buttonLoading.add || buttonLoading.edit ? (
//                       <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                     ) : editingTask ? (
//                       'Update Task'
//                     ) : (
//                       'Add Task'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="space-y-3 md:space-y-4">
//             {sortedTasks.length === 0 ? (
//               <div className="rounded-lg bg-white p-6 text-center shadow-xl dark:bg-gray-900 md:p-8">
//                 <p className="text-gray-500 dark:text-gray-400">
//                   No tasks yet. Add your first task!
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {pendingTasks.length > 0 && (
//                   <div className="mb-6">
//                     <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                       Pending Tasks ({pendingTasks.length})
//                     </h2>
//                     <div className="space-y-3 md:space-y-4">
//                       {pendingTasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                             task.status === 'completed'
//                               ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                               : isTaskOverdue(task)
//                               ? 'border-red-600'
//                               : 'border-transparent'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               <h3
//                                 className={`text-base font-semibold md:text-lg ${
//                                   task.status === 'completed'
//                                     ? 'text-green-700 line-through dark:text-green-400'
//                                     : isTaskOverdue(task)
//                                     ? 'text-red-600 dark:text-red-400'
//                                     : 'text-gray-800 dark:text-white'
//                                 }`}
//                               >
//                                 {task.heading}
//                               </h3>
//                               {task.text && (
//                                 <p
//                                   className={`mt-1 text-sm ${
//                                     task.status === 'completed'
//                                       ? 'text-green-600 dark:text-green-300'
//                                       : isTaskOverdue(task)
//                                       ? 'text-red-500 dark:text-red-300'
//                                       : 'text-gray-600 dark:text-gray-300'
//                                   }`}
//                                 >
//                                   {task.text}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex gap-1 md:gap-2">
//                               <button
//                                 onClick={() => startEditing(task)}
//                                 className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                                 title="Edit task"
//                               >
//                                 <FiEdit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleToggleStatus(task.id)}
//                                 disabled={buttonLoading.toggle === task.id}
//                                 className={`rounded-full p-1 md:p-2 ${
//                                   task.status === 'completed'
//                                     ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                     : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                                 } flex items-center justify-center transition-opacity hover:opacity-80`}
//                                 title={
//                                   task.status === 'completed'
//                                     ? 'Mark pending'
//                                     : 'Mark complete'
//                                 }
//                               >
//                                 {buttonLoading.toggle === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiCheck size={16} />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteTask(task.id)}
//                                 disabled={buttonLoading.delete === task.id}
//                                 className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                                 title="Delete task"
//                               >
//                                 {buttonLoading.delete === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiTrash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                           <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                             <span>
//                               Created:{' '}
//                               {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                             </span>
//                             {task.endTime && (
//                               <span
//                                 className={`flex items-center gap-1 ${
//                                   isTaskOverdue(task) ? 'text-red-600 dark:text-red-400' : ''
//                                 }`}
//                               >
//                                 <FiCalendar size={12} />
//                                 Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {completedTasks.length > 0 && (
//                   <div>
//                     <div className="mb-5 flex items-center justify-between">
//                       <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
//                         Completed Tasks ({completedTasks.length})
//                       </h2>
//                       {completedTasks.length > 0 && (
//                         <div className="flex justify-end">
//                           <button
//                             onClick={handleDeleteAllCompleted}
//                             disabled={buttonLoading.deleteAll}
//                             className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700 md:text-base"
//                           >
//                             {buttonLoading.deleteAll ? (
//                               <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
//                             ) : (
//                               <>
//                                 <FiTrash2 /> Clear Completed
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                     <div className="space-y-3 md:space-y-4">
//                       {completedTasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`rounded-lg border-b-4 border-l-4 bg-white p-4 shadow-xl dark:bg-gray-900 dark:text-white md:p-5 ${
//                             task.status === 'completed'
//                               ? 'border-green-600 bg-green-50 dark:bg-gray-800'
//                               : isTaskOverdue(task)
//                               ? 'border-red-600'
//                               : 'border-transparent'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               <h3
//                                 className={`text-base font-semibold md:text-lg ${
//                                   task.status === 'completed'
//                                     ? 'text-green-700 line-through dark:text-green-400'
//                                     : isTaskOverdue(task)
//                                     ? 'text-red-600 dark:text-red-400'
//                                     : 'text-gray-800 dark:text-white'
//                                 }`}
//                               >
//                                 {task.heading}
//                               </h3>
//                               {task.text && (
//                                 <p
//                                   className={`mt-1 text-sm ${
//                                     task.status === 'completed'
//                                       ? 'text-green-600 dark:text-green-300'
//                                       : isTaskOverdue(task)
//                                       ? 'text-red-500 dark:text-red-300'
//                                       : 'text-gray-600 dark:text-gray-300'
//                                   }`}
//                                 >
//                                   {task.text}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex gap-1 md:gap-2">
//                               <button
//                                 onClick={() => startEditing(task)}
//                                 className="rounded-full bg-blue-100 p-1 text-blue-600 transition-opacity hover:opacity-80 md:p-2"
//                                 title="Edit task"
//                               >
//                                 <FiEdit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleToggleStatus(task.id)}
//                                 disabled={buttonLoading.toggle === task.id}
//                                 className={`rounded-full p-1 md:p-2 ${
//                                   task.status === 'completed'
//                                     ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
//                                     : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//                                 } flex items-center justify-center transition-opacity hover:opacity-80`}
//                                 title={
//                                   task.status === 'completed'
//                                     ? 'Mark pending'
//                                     : 'Mark complete'
//                                 }
//                               >
//                                 {buttonLoading.toggle === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiCheck size={16} />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteTask(task.id)}
//                                 disabled={buttonLoading.delete === task.id}
//                                 className="flex items-center justify-center rounded-full bg-red-100 p-1 text-red-600 transition-opacity hover:opacity-80 dark:bg-red-900 dark:text-red-300 md:p-2"
//                                 title="Delete task"
//                               >
//                                 {buttonLoading.delete === task.id ? (
//                                   <span className="border-current h-3 w-3 animate-spin rounded-full border-b-2 md:h-4 md:w-4"></span>
//                                 ) : (
//                                   <FiTrash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </div>
//                           <div className="text-md mt-3 flex flex-col gap-1 text-gray-700 dark:text-gray-400 md:flex-row md:items-center md:gap-4">
//                             <span>
//                               Created:{' '}
//                               {format(task.createDate, 'MMM d, yyyy h:mm a')}
//                             </span>
//                             {task.endTime && (
//                               <span
//                                 className={`flex items-center gap-1 ${
//                                   isTaskOverdue(task) ? 'text-red-600 dark:text-red-400' : ''
//                                 }`}
//                               >
//                                 <FiCalendar size={12} />
//                                 Due: {format(task.endTime, 'MMM d, yyyy h:mm a')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TaskManager;