// import React from 'react';

// const Footer = () => (
//   <footer className="page-footer">
//           {/* <div className="container">
//             <div className="row">
//               <div className="col l6 s12">
//                 <h5 className="white-text">Footer Content</h5>
//                 <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
//               </div>
//               <div className="col l4 offset-l2 s12">
//                 <h5 className="white-text">Links</h5>
//                 <ul>
//                   <li><a className="grey-text text-lighten-3" href="#!">Scott</a></li>
//                   <li><a className="grey-text text-lighten-3" href="#!">Kristin</a></li>
//                   <li><a className="grey-text text-lighten-3" href="#!">Liz</a></li>
//                   <li><a className="grey-text text-lighten-3" href="#!">Topher</a></li>
//                 </ul>
//               </div>
//             </div>
//           </div> */}
//           <div className="footer-copyright">
//             <div className="container">
//             © 2014 Copyright Text
//             <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
//             </div>
//           </div>
//         </footer>
// );

// export default Footer;


/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "../../assets/jss/material-dashboard-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/kiacone"
                className={classes.block}
                target="_blank"
              >
                Kristin Iacone
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/ELark2016"
                className={classes.block}
                target="_blank"
              >
                Liz Lark
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/scottpetersonva"
                className={classes.block}
                target="_blank"
              >
                Scott Peterson
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/tophersymps"
                className={classes.block}
                target="_blank"
              >
                Topher Sympson
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} , check out the {" "}
          <a
            href="https://github.com/kiacone/ren_dev_ous"
            className={aClasses}
            target="_blank"
          >
            Repo here!
          </a>{"   "}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
