import { Test } from '@nestjs/testing';

import { AgencyReservationListener } from '../listeners/agency-reservation.listener';
import { ReservationService } from '../services/reservation.service';

describe('AgencyReservationListener', () => {
  let listener: AgencyReservationListener;
  const reservationService = {
    agencyUpdateSeatNumbers: jest.fn(),
    agencyUpdateStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AgencyReservationListener,
        { provide: ReservationService, useValue: reservationService },
      ],
    }).compile();
    listener = module.get(AgencyReservationListener);
  });

  it('COMPLETED → agencyUpdateStatus only', async () => {
    await listener.onAgencyReservationUpdate({
      reservationId: 'res1',
      agencyId: 'ag1',
      status: 'COMPLETED',
    });
    expect(reservationService.agencyUpdateStatus).toHaveBeenCalledWith(
      'res1',
      'ag1',
      'COMPLETED',
    );
    expect(reservationService.agencyUpdateSeatNumbers).not.toHaveBeenCalled();
  });

  it('CANCELLED → agencyUpdateStatus', async () => {
    await listener.onAgencyReservationUpdate({
      reservationId: 'res1',
      agencyId: 'ag1',
      status: 'CANCELLED',
    });
    expect(reservationService.agencyUpdateStatus).toHaveBeenCalledWith(
      'res1',
      'ag1',
      'CANCELLED',
    );
  });

  it('seatNumbers + CONFIRMED → both booking writes', async () => {
    await listener.onAgencyReservationUpdate({
      reservationId: 'res1',
      agencyId: 'ag1',
      status: 'CONFIRMED',
      seatNumbers: '1A,1B',
    });
    expect(reservationService.agencyUpdateSeatNumbers).toHaveBeenCalledWith(
      'res1',
      'ag1',
      '1A,1B',
    );
    expect(reservationService.agencyUpdateStatus).toHaveBeenCalledWith(
      'res1',
      'ag1',
      'CONFIRMED',
    );
  });
});
