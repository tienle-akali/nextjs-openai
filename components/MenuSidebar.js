import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

import PropTypes from "prop-types";

function MenuSidebar({ menu = [] }) {
  const { pathname } = useRouter();
  const selectedMenuItem = menu.findIndex((item) => item.path === pathname);

  return (
    <List>
      {menu.map((menuItem, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            LinkComponent={Link}
            href={menuItem?.path}
            selected={index === selectedMenuItem}
          >
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
