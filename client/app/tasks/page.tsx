"use client"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useReducer } from "react";
import Tasks from "./task";
import Filter from "@/components/Filter";

const initialState = {
  sortBy: "dueDate",
  filterPriority: "ALL",
  filterStatus: "ALL",
  filterDueDate: "ALL",
  activeTab: "Tasks"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: typeof initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_FILTER_DUE_DATE':
      return { ...state, filterDueDate: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};

const TasksPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className='w-full flex flex-col pl-12 justify-center min-h-screen bg-white dark:bg-stone-900'>
      <div className="bg-background/40 backdrop-blur-md rounded-lg shadow-lg shadow-neutral-800/5 border border-primary/10 pt-2 px-2 absolute left-0 top-[14vh] m-2 sm:m-3 sm:left-[8vh] md:m-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
          <Tabs
            defaultValue="Tasks"
            className="rounded-md"
            value={state.activeTab}
            onValueChange={(value) => dispatch({ type: 'SET_ACTIVE_TAB', payload: value })}>
            <TabsList className="grid grid-cols-2 w-48 gap-2">
              <TabsTrigger value="Tasks" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tasks</TabsTrigger>
              <TabsTrigger value="Dashboard" className="text-xs sm:text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
            </TabsList>
          </Tabs>

        </div>
      </div>
      {state.activeTab === "Tasks" && (
        <>
          <Filter state={state} dispatch={dispatch} />
          <Tasks
            filterDueDate={state.filterDueDate}
            filterPriority={state.filterPriority}
            filterStatus={state.filterStatus}
            sortBy={state.sortBy}

          />
        </>
      )}
      {state.activeTab === "Dashboard" && (
        <div>Dashboard</div>
      )}
    </div>
  );
}
export default TasksPage;
