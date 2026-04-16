import Swal from "sweetalert2";

export function Alert(message, type, position, isToast = true) {
    return Swal.fire({
        position: position,
        icon: type,
        text: message,
        showConfirmButton: false,
        timer: 1500,
        toast: isToast,
    });
}
