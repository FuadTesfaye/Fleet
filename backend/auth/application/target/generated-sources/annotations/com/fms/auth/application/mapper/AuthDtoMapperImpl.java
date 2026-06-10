package com.fms.auth.application.mapper;

import com.fms.auth.application.dto.response.UserSummaryDto;
import com.fms.auth.domain.entity.User;
import com.fms.auth.domain.enums.UserStatus;
import com.fms.auth.domain.valueobject.Email;
import com.fms.auth.domain.valueobject.UserId;
import java.util.Set;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-10T15:28:57+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class AuthDtoMapperImpl implements AuthDtoMapper {

    @Override
    public UserSummaryDto toUserSummary(User user) {
        if ( user == null ) {
            return null;
        }

        UUID id = null;
        String email = null;
        String firstName = null;
        String lastName = null;
        String phoneNumber = null;
        UserStatus status = null;

        id = userUserIdValue( user );
        email = userEmailValue( user );
        firstName = user.getFirstName();
        lastName = user.getLastName();
        phoneNumber = user.getPhoneNumber();
        status = user.getStatus();

        Set<String> roles = mapRoles(user);

        UserSummaryDto userSummaryDto = new UserSummaryDto( id, email, firstName, lastName, phoneNumber, status, roles );

        return userSummaryDto;
    }

    private UUID userUserIdValue(User user) {
        if ( user == null ) {
            return null;
        }
        UserId userId = user.getUserId();
        if ( userId == null ) {
            return null;
        }
        UUID value = userId.value();
        if ( value == null ) {
            return null;
        }
        return value;
    }

    private String userEmailValue(User user) {
        if ( user == null ) {
            return null;
        }
        Email email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        String value = email.value();
        if ( value == null ) {
            return null;
        }
        return value;
    }
}
