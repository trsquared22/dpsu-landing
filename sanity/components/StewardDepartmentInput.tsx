import { Select } from "@sanity/ui";
import { set, unset, useFormValue, type StringInputProps } from "sanity";

// Renders the steward's "department" field as a dropdown of the establishment's
// own subOptions list (the document's sibling field) instead of free text, so
// there's no way for an editor's typo to break the ministry -> steward match
// used on the public site.
export function StewardDepartmentInput(props: StringInputProps) {
  const subOptions = (useFormValue(["subOptions"]) as string[] | undefined) ?? [];
  const value = props.value ?? "";

  if (subOptions.length === 0) {
    return (
      <Select disabled value="">
        <option value="">Add ministries / departments above first</option>
      </Select>
    );
  }

  return (
    <Select
      value={value}
      onChange={(event) => {
        const next = event.currentTarget.value;
        props.onChange(next ? set(next) : unset());
      }}
    >
      <option value="">General (all ministries / departments)</option>
      {subOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}
