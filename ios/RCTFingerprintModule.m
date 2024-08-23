//
//  RCTFingerprintModule.m
//  AwesomeProject
//
//  Created by Alexander de Leon on 12/08/22.
//

#import "RCTFingerprintModule.h"
#import <FPL/FPL.h>
#import <CoreLocation/CoreLocation.h>
@implementation RCTFingerprintModule
RCT_EXPORT_MODULE(FingerprintModule);

RCT_EXPORT_METHOD(getFingerprint:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  CLLocationManager *loc = [[CLLocationManager alloc] init];
  [loc requestWhenInUseAuthorization];
  FingerPrint *fp = [[FingerPrint alloc] init];
  NSString *fingerprint = [fp getDataWithToken:@"BwfSJxuANSbGW0B" action:@"LOGIN"];
  NSLog(@"Fingerprint: %@\n", fingerprint );
  if (fingerprint){
    resolve(fingerprint);
  } else {
    reject(@"fingerprint_failure", @"no fingerprint returned", nil);
  }
}
@end
