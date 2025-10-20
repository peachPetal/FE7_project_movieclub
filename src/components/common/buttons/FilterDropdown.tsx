import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  FILTER_OPTIONS,
  type FilterOption,
  type FilterType,
} from "../../../types/Filter";

export default function FilterDropdown({
  type,
  filter,
  handleChangeFilter,
}: {
  type: FilterType;
  filter: FilterOption;
  handleChangeFilter: (filter: FilterOption) => void;
}) {
  const options = FILTER_OPTIONS[type as keyof typeof FILTER_OPTIONS];

  return (
    <div className="w-[200px] border border-main rounded-[10px] z-10">
      <Listbox value={filter} onChange={handleChangeFilter}>
        <div className="relative mt-1">
          <Listbox.Button className="w-full rounded-[10px] bg-background-main py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm cursor-pointer text-main">
            {({ open }) => (
              <>
                <span className="block truncate">{filter?.value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {open ? (
                    <ChevronUpIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background-main py-1 text-base focus:outline-none sm:text-sm border border-main">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-main-10 text-main" : "text-text-main"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium text-main" : "font-normal"
                        }`}
                      >
                        {option.value}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
