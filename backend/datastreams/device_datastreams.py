from devices.openpose.openpose import OpenPoseInstance
from datastreams.datastreams import Datastreams
from devices.openface.openface import OpenFaceInstance
from devices.eye_tracker.stationary_eye_tracker import StationaryEyeTracker
from devices.eye_tracker.mobile_eye_tracker import MobileEyeTracker
from devices.wristband.wristband import Wristband
from datamodels.skeletal import SkeletalNodeCollection
import asyncio


class DeviceDatastreams(Datastreams):

    """
    This class is a subclass of Datastreams, see datastreams.py for more info and documentation of the individual methods.
    In this subclass the datastreams comes from the devices, and the datastreams for each individual device is delegated to its respective class.
    See the devices folder for how each device is handled.
    """

    openface = None
    openpose = None
    stationary_eye_tracker = None
    mobile_eye_tracker = None
    wristband = None

    loop = None
    device_mode = "stationary"

    def __init__(self, device_mode, loop):
        """
        Here all the devices are setup. device_mode means either "stationary" or "mobile". 
        "stationary" uses OpenFace and StationaryEyeTracker. "mobile" uses OpenPose and MobileEyeTracker
        """
        self.loop = loop
        self.device_mode = device_mode
        if self.device_mode == "stationary":
            self.openface = OpenFaceInstance()
            self.openface.startProcess()
            self.stationary_eye_tracker = StationaryEyeTracker()
        elif self.device_mode == "mobile":
            self.openpose = OpenPoseInstance()
            self.openpose.startProcess()
            self.mobile_eye_tracker = MobileEyeTracker()
            self.mobile_eye_tracker.calibrate()

        self.wristband = Wristband(self.loop)

    def start(self):
        if self.device_mode == "stationary":
            self.openface.startDataRead()
            self.stationary_eye_tracker.subscribe()
        if self.device_mode == "mobile":
            asyncio.run_coroutine_threadsafe(
                self.mobile_eye_tracker.run(self.loop), self.loop)

        asyncio.run_coroutine_threadsafe(self.wristband.subscribe(), self.loop)

    def terminate(self):
        if self.device_mode == "stationary":
            self.openface.stopDataRead()
            self.openface.terminateProcess()
            self.stationary_eye_tracker.unsubscribe()
        elif self.device_mode == "mobile":
            self.openpose.terminateProcess()
            self.mobile_eye_tracker.terminate()

        asyncio.run_coroutine_threadsafe(
            self.wristband.unsubscribe(), self.loop)

    def clear_current_data(self):
        if self.device_mode == "stationary":
            self.openface.clearCurrentData()
            self.stationary_eye_tracker.clear_current_data()
        elif self.device_mode == "mobile":
            self.openpose.clearCurrentData()
            self.mobile_eye_tracker.clear_current_data()

        self.wristband.clear_current_data()

    def get_current_au_data(self):
        if self.device_mode == "stationary":
            return self.openface.getCurrentData()
        else:
            return []

    def get_current_acc_data(self):
        return self.wristband.get_current_acc_data()

    def get_current_bvp_data(self):
        return self.wristband.get_current_bvp_data()

    def get_current_eda_data(self):
        return self.wristband.get_current_gsr_data()

    def get_current_hr_data(self):
        return self.wristband.get_current_hr_data()

    def get_current_ibi_data(self):
        return self.wristband.get_current_ibi_data()

    def get_current_temp_data(self):
        return self.wristband.get_current_tmp_data()

    def get_current_skeleton_data(self):
        if self.device_mode == "stationary":
            return SkeletalNodeCollection([])
        elif self.device_mode == "mobile":
            return self.openpose.getCurrentData()

    def get_current_eye_tracking_data(self):
        if self.device_mode == "stationary":
            return self.stationary_eye_tracker.get_current_data()
        elif self.device_mode == "mobile":
            return self.mobile_eye_tracker.get_current_data()
