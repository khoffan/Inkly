import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropTypes } from "prop-types";

export default function IconAwesome({ iconName }) {
    IconAwesome.propTypes = {
        iconName: PropTypes.object.isRequired,
    };
    return <FontAwesomeIcon className="text-xl" icon={iconName} />;
}
