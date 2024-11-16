import * as THREE from 'three';

export function createCamera(gameWindow) {
    
    const DEG2RAD = Math.PI / 180;
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;
    
    const MIN_CAMERA_RADIUS = 2;
    const MAX_CAMERA_RADIUS = 10;
    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SENSITIVITY = 0.5;
    const ZOOM_SENSITIVITY = 0.02;
    const PAN_SENSITIVITY = -0.01;
    
    const Y_AXIS = new THREE.Vector3(0,1,0);
    
    
    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetHeight / gameWindow.offsetHeight, 0.1, 1000);
    let cameraOrigin = new THREE.Vector3();
    let cameraRadius = 4;
    let cameraAzimuth = 0;
    let cameraElevation = 0;
    let isMouseDown = false;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    updateCameraPosition();

    function onMouseDown(event) {
        console.log('mousedown');
        isMouseDown = true;
        
        if(event.button === LEFT_MOUSE_BUTTON){
            isLeftMouseDown = true;
        }
        if(event.button === MIDDLE_MOUSE_BUTTON){
            isMiddleMouseDown = true;
        }
        if(event.button === RIGHT_MOUSE_BUTTON){
            isRightMouseDown = true;
        }
    }

    function onMouseUp(event) {
        console.log('mouseup');
        isMouseDown = false;
    }

    function onMouseMove(event) {
        console.log("mousemove");
        
        const deltaX = (event.clientX - prevMouseX);
        const deltaY = (event.clientY - prevMouseY);
        
        // Handles the rotation of the camera
        if(isLeftMouseDown) {
            cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
            cameraElevation += (deltaY * ROTATION_SENSITIVITY);
            cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
            updateCameraPosition();
        }
        
        //Handles the panning of the camera
        if(isMiddleMouseDown){
            const forward = new THREE.Vector3(0,0,1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1,0,0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
            cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
            updateCameraPosition();
        }
        
        //Handles the zoom of the camera
        if(isRightMouseDown){
            cameraRadius += deltaY * ZOOM_SENSITIVITY;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }
        
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function updateCameraPosition() {
        const newX = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        const newY = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        const newZ = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);

        if (
            camera.position.x !== newX ||
            camera.position.y !== newY ||
            camera.position.z !== newZ
        ) {
            camera.position.set(newX, newY, newZ);
            camera.position.add(cameraOrigin);
            camera.lookAt(cameraOrigin);
        }
    }

    return{
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}