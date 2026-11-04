import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";

import PropTypes from "prop-types";

function MenuSidebar({ menu = [] }) {
  return (
    <List>
      {menu.map((menuItem, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton LinkComponent={Link} href={menuItem?.path}>
            <ListItemText primary={menuItem?.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
MenuSidebar.propTypes = {
  menu: PropTypes.array,
};

export default MenuSidebar;
