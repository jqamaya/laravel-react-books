import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";

type MenuItemData = {
  value: string | number | undefined;
  label: string;
}
type Props = SelectProps & {
  label: string;
  items: MenuItemData[];
  containerProps?: FormControlProps;
}

export default function Dropdown({
  label,
  items,
  containerProps,
  ...rest
}: Props) {
  return (
    <FormControl fullWidth {...containerProps}>
      <InputLabel id="data-export">{label}</InputLabel>
      <Select
        labelId="data-export"
        label={label}
        {...rest}
      >
        {items.map(({ value, label }, index) => (
          <MenuItem
            value={value}
            key={index}
            sx={{ color: value ? 'text.primary' : 'text.disabled' }}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
